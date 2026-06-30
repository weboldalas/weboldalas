'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { buildVariableMap, substituteVariables } from '@/lib/document-variables'

// -----------------------------------------------
// Log activity
// -----------------------------------------------
async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentId: string,
  action: string,
  description: string,
) {
  await supabase.from('document_activity').insert([{ document_id: documentId, action, description }])
}

// -----------------------------------------------
// Create document (with version 1)
// -----------------------------------------------
export async function createDocument(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const templateId = formData.get('template_id') as string
  const customerId = (formData.get('customer_id') as string) || null
  const offerId = (formData.get('offer_id') as string) || null
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const notes = (formData.get('notes') as string) || null
  const variables = JSON.parse((formData.get('variables') as string) || '{}')

  if (!title || !content) return { error: 'Hiányzó kötelező mezők.' }

  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert([{
      type: 'contract',
      title,
      customer_id: customerId,
      offer_id: offerId,
      template_id: templateId || null,
      status: 'draft',
      variables,
      notes,
      current_version: 1,
    }])
    .select('id')
    .single()

  if (docError || !doc) return { error: docError?.message || 'Hiba a dokumentum létrehozásakor.' }

  // Create version 1
  const { error: versionError } = await supabase.from('document_versions').insert([{
    document_id: doc.id,
    version: 1,
    content,
  }])

  if (versionError) return { error: versionError.message }

  await logActivity(supabase, doc.id, 'created', 'Dokumentum létrehozva (v1)')

  revalidatePath('/contracts')
  redirect(`/contracts/${doc.id}`)
}

// -----------------------------------------------
// Save new version of document content
// -----------------------------------------------
export async function saveDocumentVersion(
  documentId: string,
  content: string,
  currentVersion: number,
) {
  const supabase = await createClient()
  const newVersion = currentVersion + 1

  const { error: versionError } = await supabase.from('document_versions').insert([{
    document_id: documentId,
    version: newVersion,
    content,
  }])
  if (versionError) return { error: versionError.message }

  const { error: docError } = await supabase
    .from('documents')
    .update({ current_version: newVersion })
    .eq('id', documentId)
  if (docError) return { error: docError.message }

  await logActivity(supabase, documentId, 'edited', `Új verzió mentve (v${newVersion})`)

  revalidatePath(`/contracts/${documentId}`)
  return { success: true, newVersion }
}

// -----------------------------------------------
// Overwrite current version (no new version)
// -----------------------------------------------
export async function updateCurrentVersionContent(
  documentId: string,
  versionId: string,
  content: string,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('document_versions')
    .update({ content })
    .eq('id', versionId)

  if (error) return { error: error.message }

  revalidatePath(`/contracts/${documentId}`)
  return { success: true }
}

// -----------------------------------------------
// Update document status
// -----------------------------------------------
export async function updateDocumentStatus(documentId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('documents')
    .update({ status })
    .eq('id', documentId)

  if (error) return { error: error.message }

  const STATUS_LABELS: Record<string, string> = {
    draft: 'Tervezet', generated: 'Generálva', sent: 'Elküldve',
    signed: 'Aláírva', archived: 'Archivált', cancelled: 'Visszavonva',
  }
  await logActivity(supabase, documentId, 'status_changed', `Státusz: ${STATUS_LABELS[status] ?? status}`)

  revalidatePath(`/contracts/${documentId}`)
  revalidatePath('/contracts')
  return { success: true }
}

// -----------------------------------------------
// Update PDF URL on current version + set status
// -----------------------------------------------
export async function updateVersionPdfUrl(
  documentId: string,
  versionId: string,
  pdfUrl: string,
) {
  const supabase = await createClient()

  await supabase
    .from('document_versions')
    .update({ pdf_url: pdfUrl, generated_at: new Date().toISOString() })
    .eq('id', versionId)

  await supabase
    .from('documents')
    .update({ status: 'generated' })
    .eq('id', documentId)

  await logActivity(supabase, documentId, 'pdf_generated', 'PDF generálva és mentve')

  revalidatePath(`/contracts/${documentId}`)
  revalidatePath('/contracts')
  return { success: true }
}

// -----------------------------------------------
// Save signatures on version
// -----------------------------------------------
export async function saveSignatures(
  documentId: string,
  versionId: string,
  clientSignature: string,
  companySignature: string,
) {
  const supabase = await createClient()

  await supabase
    .from('document_versions')
    .update({
      client_signature: clientSignature,
      company_signature: companySignature,
      signed_at: new Date().toISOString(),
    })
    .eq('id', versionId)

  await supabase
    .from('documents')
    .update({ status: 'signed' })
    .eq('id', documentId)

  await logActivity(supabase, documentId, 'signed', 'Mindkét fél aláírta')

  revalidatePath(`/contracts/${documentId}`)
  revalidatePath('/contracts')
  return { success: true }
}

// -----------------------------------------------
// Log email sent
// -----------------------------------------------
export async function logEmailSent(documentId: string, recipientEmail: string) {
  const supabase = await createClient()
  await supabase
    .from('documents')
    .update({ status: 'sent' })
    .eq('id', documentId)
  await logActivity(supabase, documentId, 'email_sent', `Email elküldve: ${recipientEmail}`)
  revalidatePath(`/contracts/${documentId}`)
  revalidatePath('/contracts')
  return { success: true }
}

// -----------------------------------------------
// Delete document
// -----------------------------------------------
export async function deleteDocument(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) return { error: 'Hiba a törlés során.' }
  revalidatePath('/contracts')
  redirect('/contracts')
}

// -----------------------------------------------
// Quick-create customer (used in wizard)
// -----------------------------------------------
export async function quickCreateCustomer(formData: FormData) {
  const supabase = await createClient()

  const isCompany = formData.get('is_company') === 'true'
  const data = {
    is_company: isCompany,
    name: (formData.get('name') as string) || null,
    company_name: (formData.get('company_name') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    tax_number: (formData.get('tax_number') as string) || null,
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert([data])
    .select('id, name, email, phone, is_company, company_name, contact_name, address, tax_number, registration_number')
    .single()

  if (error || !customer) return { error: error?.message || 'Hiba az ügyfél létrehozásakor.' }

  revalidatePath('/customers')
  return { customer }
}

// -----------------------------------------------
// Build document content from template + data
// -----------------------------------------------
export async function buildDocumentFromTemplate(
  templateId: string,
  customerId: string | null,
  offerId: string | null,
  manualVars: Record<string, string> = {},
): Promise<{ content: string; title: string; variables: Record<string, string> } | { error: string }> {
  const supabase = await createClient()

  const [
    { data: template },
    { data: companySettings },
    { data: customer },
    { data: offer },
  ] = await Promise.all([
    supabase.from('document_templates').select('*').eq('id', templateId).single(),
    supabase.from('company_settings').select('*').limit(1).single(),
    customerId
      ? supabase.from('customers').select('*').eq('id', customerId).single()
      : Promise.resolve({ data: null }),
    offerId
      ? supabase.from('offers').select('*, offer_items(*)').eq('id', offerId).single()
      : Promise.resolve({ data: null }),
  ])

  if (!template) return { error: 'Sablon nem található.' }

  const variableMap = buildVariableMap(
    companySettings ?? {},
    customer,
    offer ? { total_amount: offer.total_amount, payment_type: offer.payment_type, installment_months: offer.installment_months } : null,
    manualVars,
  )

  const content = substituteVariables(template.content, variableMap)
  const clientName = customer?.is_company
    ? (customer.company_name || customer.name || 'Névtelen')
    : (customer?.name || 'Névtelen')
  const title = `${template.name} – ${clientName}`

  return { content, title, variables: variableMap }
}
