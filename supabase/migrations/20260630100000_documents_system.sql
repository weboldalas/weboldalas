-- ================================================
-- DOCUMENT MANAGEMENT SYSTEM
-- Replaces simple contracts table with a full
-- versioned document center
-- ================================================

-- 1. Drop old contracts table
DROP TABLE IF EXISTS contracts CASCADE;

-- 2. Extend customers with business fields
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_company boolean DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS contact_name text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_number text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS registration_number text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes text;

-- 3. Company settings (singleton)
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text DEFAULT 'Weboldalas.hu Kft.',
  logo_url text,
  address text,
  tax_number text,
  registration_number text,
  bank_account text,
  representative_name text,
  email text,
  phone text,
  website text DEFAULT 'weboldalas.hu',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_company_settings"
  ON company_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO company_settings (company_name, website)
VALUES ('Weboldalas.hu Kft.', 'weboldalas.hu');

-- 4. Document templates
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'contract',
  description text,
  content text NOT NULL DEFAULT '',
  is_active boolean DEFAULT true
);

ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_document_templates"
  ON document_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  type text NOT NULL DEFAULT 'contract',
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  offer_id uuid REFERENCES offers(id) ON DELETE SET NULL,
  template_id uuid REFERENCES document_templates(id) ON DELETE SET NULL,
  current_version integer DEFAULT 1,
  variables jsonb DEFAULT '{}'::jsonb,
  notes text
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_documents"
  ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Document versions
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content text NOT NULL,
  pdf_url text,
  generated_at timestamptz,
  client_signature text,
  company_signature text,
  signed_at timestamptz
);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_document_versions"
  ON document_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Document activity log
CREATE TABLE IF NOT EXISTS document_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  action text NOT NULL,
  description text
);

ALTER TABLE document_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_document_activity"
  ON document_activity FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Storage bucket for document PDFs (reuse 'contracts' bucket)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'contracts') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);
  END IF;
END $$;

-- Ensure storage policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can upload contracts'
  ) THEN
    CREATE POLICY "Authenticated users can upload contracts"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'contracts');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can read contracts'
  ) THEN
    CREATE POLICY "Authenticated users can read contracts"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'contracts');
  END IF;
END $$;

-- 9. Seed 5 contract templates
INSERT INTO document_templates (name, type, description, content) VALUES
(
  'Weboldal fejlesztési szerződés',
  'contract',
  'Egyedi weboldal tervezés és fejlesztés',
  'WEBOLDAL FEJLESZTÉSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cégjegyzékszám: {{client_registration}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}}
Képviselő: {{company_rep}}
Adószám: {{company_tax}}
Cégjegyzékszám: {{company_registration}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}

---

1. A SZERZŐDÉS TÁRGYA

Jelen megbízási szerződés alapján a Megbízott vállalja {{project_description}} megvalósítását a Megbízó részére, a jelen szerződésben foglalt feltételek szerint.

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

Megbízási díj: {{offer_price}} Ft + ÁFA

Fizetési feltételek: {{payment_terms}}

3. TELJESÍTÉSI HATÁRIDŐ

{{deadline}}

4. A MEGBÍZÓ KÖTELEZETTSÉGEI

A Megbízó köteles:
- az elvégzendő munkához szükséges anyagokat, tartalmakat és hozzáféréseket időben rendelkezésre bocsátani,
- a Megbízott kérdéseire és visszajelzéseire 5 munkanapon belül reagálni,
- a szerződésben rögzített díjat határidőre megfizetni.

5. A MEGBÍZOTT KÖTELEZETTSÉGEI

A Megbízott köteles:
- a vállalt munkát határidőre, szakszerűen elvégezni,
- a Megbízót a munka előrehaladásáról rendszeresen tájékoztatni,
- a Megbízó üzleti titkait megőrizni.

6. SZELLEMI TULAJDON

A projekt teljes díjának megfizetése után a weboldal forráskódja és vizuális elemei a Megbízó tulajdonába kerülnek.

7. GARANCIA

A Megbízott az átadást követő 30 (harminc) napban garanciát vállal a weboldal hibamentes működésére. A garancia nem vonatkozik a Megbízó által elvégzett módosításokból eredő hibákra.

8. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott üzleti és személyes adatokat titkosan kezelik, és azokat harmadik személy részére nem adják át.

9. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv rendelkezései az irányadók. Felek jogvitáikat elsősorban tárgyalás útján kísérlik meg rendezni.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott'
),
(
  'Havidíjas karbantartási szerződés',
  'contract',
  'Rendszeres havi weboldal karbantartás',
  'HAVIDÍJAS KARBANTARTÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}}
Képviselő: {{company_rep}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja a Megbízó weboldalának és digitális rendszereinek rendszeres karbantartását és üzemeltetési támogatását.

Ellátandó feladatok: {{project_description}}

2. DÍJAZÁS

Havi karbantartási díj: {{offer_price}} Ft/hó + ÁFA

Fizetési feltételek: {{payment_terms}}

3. A SZERZŐDÉS IDŐTARTAMA

{{deadline}}

A szerződés határozatlan időre szól, és mindkét fél 30 (harminc) napos felmondási idővel, írásban mondhatja fel.

4. KARBANTARTÁS TARTALMA

A havidíjas csomag tartalmazza:
- CMS frissítések (havonta)
- Biztonsági mentések (heti rendszerességgel)
- Rendelkezésre állás figyelés
- Kisebb tartalomfrissítések (max. 2 óra/hó)
- E-mail alapú technikai támogatás

5. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott adatokat bizalmasan kezelik.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott'
),
(
  'Webshop fejlesztési szerződés',
  'contract',
  'WooCommerce / egyedi webshop fejlesztés',
  'WEBSHOP FEJLESZTÉSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cégjegyzékszám: {{client_registration}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}}
Képviselő: {{company_rep}}
Adószám: {{company_tax}}
Cégjegyzékszám: {{company_registration}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja egy webshop fejlesztését és üzembe helyezését: {{project_description}}

A fejlesztés kiterjed:
- Webshop tervezésre és fejlesztésre
- Termékek és kategóriák felállítására
- Fizetési rendszer integrációra
- Szállítási modulok konfigurációjára
- Admin felület oktatásra

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

Megbízási díj: {{offer_price}} Ft + ÁFA

Fizetési feltételek: {{payment_terms}}

3. TELJESÍTÉSI HATÁRIDŐ

{{deadline}}

4. SZELLEMI TULAJDON

A teljes díj kifizetése után a webshop forráskódja és designja a Megbízó tulajdonába kerül.

5. GARANCIA

A Megbízott az átadást követő 30 napban garanciát vállal a webshop hibamentes működésére.

6. TITOKTARTÁS

Felek kötelezettséget vállalnak a bizalmas adatok megőrzésére.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott'
),
(
  'Marketing megbízási szerződés',
  'contract',
  'Online marketing, SEO, közösségi média megbízás',
  'MARKETING MEGBÍZÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}}
Képviselő: {{company_rep}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja az alábbi marketing tevékenységek elvégzését a Megbízó részére:

{{project_description}}

2. DÍJAZÁS

Havi marketing díj: {{offer_price}} Ft/hó + ÁFA

Fizetési feltételek: {{payment_terms}}

3. A SZERZŐDÉS IDŐTARTAMA

{{deadline}}

A szerződés mindkét fél részéről 30 napos felmondási idővel megszüntethető.

4. MEGBÍZOTT KÖTELEZETTSÉGEI

A Megbízott köteles:
- a vállalt marketing tevékenységeket rendszeresen elvégezni,
- havi riportot készíteni az eredményekről,
- a Megbízó brandjének megfelelő kommunikációt biztosítani.

5. TITOKTARTÁS ÉS ADATVÉDELEM

A Megbízott köteles a Megbízó üzleti adatait, ügyfeleit és stratégiáját bizalmasan kezelni.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott'
),
(
  'Általános megbízási szerződés',
  'contract',
  'Egyéb IT / digitális megbízáshoz',
  'MEGBÍZÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}}
Képviselő: {{company_rep}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}

---

1. A SZERZŐDÉS TÁRGYA

Jelen megbízási szerződés alapján a Megbízott vállalja az alábbi feladatok elvégzését:

{{project_description}}

2. DÍJAZÁS

Megbízási díj: {{offer_price}} Ft + ÁFA

Fizetési feltételek: {{payment_terms}}

3. TELJESÍTÉSI HATÁRIDŐ

{{deadline}}

4. FELEK KÖTELEZETTSÉGEI

A Megbízott köteles a vállalt munkát szakszerűen és határidőre elvégezni.
A Megbízó köteles az elvégzett munkáért a díjat határidőre megfizetni.

5. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződéses jogviszonyból tudomásukra jutott adatokat bizalmasan kezelik.

6. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv rendelkezései az irányadók.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott'
);
