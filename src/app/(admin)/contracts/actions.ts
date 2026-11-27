'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { requestMetaFromHeaders } from '@/lib/crm/request-meta'
import { buildVariableMap, substituteVariables } from '@/lib/document-variables'

async function getRequestMeta() {
  return requestMetaFromHeaders(await headers())
}

// -----------------------------------------------
// Log activity
// -----------------------------------------------
type ActivityMeta = { ip: string; browser: string; os: string; device: string }

async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentId: string,
  action: string,
  description: string,
  metadata?: ActivityMeta,
) {
  await supabase.from('document_activity').insert([{
    document_id: documentId,
    action,
    description,
    ...(metadata ? { metadata } : {}),
  }])
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

  const { error: versionError } = await supabase.from('document_versions').insert([{
    document_id: doc.id,
    version: 1,
    content,
  }])

  if (versionError) return { error: versionError.message }

  const meta = await getRequestMeta()
  await logActivity(supabase, doc.id, 'created', 'Dokumentum létrehozva (v1)', meta)

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

  const meta = await getRequestMeta()
  await logActivity(supabase, documentId, 'edited', `Új verzió mentve (v${newVersion})`, meta)

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
  const meta = await getRequestMeta()
  await logActivity(supabase, documentId, 'status_changed', `Státusz: ${STATUS_LABELS[status] ?? status}`, meta)

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
  pdfHash?: string,
) {
  const supabase = await createClient()

  await supabase
    .from('document_versions')
    .update({
      pdf_url: pdfUrl,
      generated_at: new Date().toISOString(),
      ...(pdfHash ? { pdf_hash: pdfHash } : {}),
    })
    .eq('id', versionId)

  await supabase
    .from('documents')
    .update({ status: 'generated' })
    .eq('id', documentId)

  const meta = await getRequestMeta()
  await logActivity(supabase, documentId, 'pdf_generated', `PDF generálva${pdfHash ? ` · SHA-256: ${pdfHash.slice(0, 12)}…` : ''}`, meta)

  revalidatePath(`/contracts/${documentId}`)
  revalidatePath('/contracts')
  return { success: true }
}

// -----------------------------------------------
// Save signatures on version + lock document
// -----------------------------------------------
export async function saveSignatures(
  documentId: string,
  versionId: string,
  clientSignature: string,
  companySignature: string,
) {
  const supabase = await createClient()
  const now = new Date().toISOString()

  await supabase
    .from('document_versions')
    .update({
      client_signature: clientSignature,
      company_signature: companySignature,
      signed_at: now,
    })
    .eq('id', versionId)

  await supabase
    .from('documents')
    .update({ status: 'signed', locked_at: now })
    .eq('id', documentId)

  const meta = await getRequestMeta()
  await logActivity(supabase, documentId, 'signed', 'Dokumentum aláírva és zárolva', meta)

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
  const meta = await getRequestMeta()
  await logActivity(supabase, documentId, 'email_sent', `Email elküldve: ${recipientEmail}`, meta)
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
  const str = (key: string) => (formData.get(key) as string)?.trim() || null
  const data = {
    is_company: isCompany,
    name: str('name') ?? str('company_name') ?? str('contact_name'),
    company_name: str('company_name'),
    contact_name: str('contact_name'),
    email: str('email'),
    phone: str('phone'),
    address: str('address'),
    tax_number: str('tax_number'),
    registration_number: str('registration_number'),
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert([data])
    .select('id, name, email, phone, is_company, company_name, contact_name, address, tax_number, registration_number')
    .single()

  if (error || !customer) return { error: error?.message || 'Hiba az ügyfél létrehozásakor.' }

  revalidatePath('/partners')
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
