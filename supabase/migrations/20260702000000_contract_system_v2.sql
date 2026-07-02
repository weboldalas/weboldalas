-- ================================================
-- CONTRACT SYSTEM V2
-- - Expand company_settings (business_type, brand_name, tax_form)
-- - Add pdf_hash to document_versions
-- - Add locked_at to documents
-- - Add company-assets storage bucket for logo upload
-- - Update 5 contract templates (AAM-friendly, new variables)
-- ================================================

-- 1. Expand company_settings
ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'Egyéni vállalkozó',
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS tax_form text DEFAULT 'aam';

-- 2. Seed correct data
UPDATE company_settings SET
  company_name         = 'Balda László Tamás',
  representative_name  = 'Balda László Tamás',
  business_type        = 'Egyéni vállalkozó',
  brand_name           = 'Weboldalas',
  tax_form             = 'aam',
  address              = '5700 Gyula, Wesselényi utca 26/B.',
  tax_number           = '59664105-1-24',
  registration_number  = NULL,
  bank_account         = '11600006-00000000-98016132',
  website              = 'https://weboldalas.hu';

-- 3. Add pdf_hash and locked_at
ALTER TABLE document_versions
  ADD COLUMN IF NOT EXISTS pdf_hash text;

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS locked_at timestamptz;

-- 4. company-assets storage bucket (public, for logo)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read company assets'
  ) THEN
    CREATE POLICY "Public read company assets"
      ON storage.objects FOR SELECT USING (bucket_id = 'company-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth upload company assets'
  ) THEN
    CREATE POLICY "Auth upload company assets"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'company-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth update company assets'
  ) THEN
    CREATE POLICY "Auth update company assets"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'company-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth delete company assets'
  ) THEN
    CREATE POLICY "Auth delete company assets"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'company-assets');
  END IF;
END $$;

-- 5. Update template: Weboldal fejlesztési szerződés
UPDATE document_templates SET content = $TPL1$WEBOLDAL FEJLESZTÉSI SZERZŐDÉS

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
{{company_name}} ({{business_type}})
Márkanév: {{company_brand}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}
Weboldal: {{company_website}}

---

1. A SZERZŐDÉS TÁRGYA

Jelen megbízási szerződés alapján a Megbízott vállalja az alábbi feladat elvégzését:

Projekt neve: {{project_name}}
Fejlesztés tartalma: {{project_description}}

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

Vállalási díj: {{offer_price}} Ft

{{aam_note}}

Fizetési ütemezés: {{payment_terms}}

3. TELJESÍTÉSI HATÁRIDŐ

Kezdési dátum: {{contract_start}}
Átadási határidő: {{deadline}}

4. A MEGBÍZÓ KÖTELEZETTSÉGEI

A Megbízó köteles:
- az elvégzendő munkához szükséges anyagokat, tartalmakat és hozzáféréseket határidőre rendelkezésre bocsátani,
- a Megbízott kérdéseire 5 munkanapon belül reagálni,
- a szerződésben rögzített díjat határidőre megfizetni.

5. A MEGBÍZOTT KÖTELEZETTSÉGEI

A Megbízott köteles:
- a vállalt munkát a megadott határidőre szakszerűen elvégezni,
- a Megbízót a munka előrehaladásáról rendszeresen tájékoztatni,
- a Megbízó üzleti titkait megőrizni.

6. SZELLEMI TULAJDON

A projekt teljes díjának megfizetése után a weboldal forráskódja és vizuális elemei a Megbízó kizárólagos tulajdonába kerülnek.

7. GARANCIA

A Megbízott az átadást követő {{warranty}} garanciát vállal a weboldal rendeltetésszerű működésére. A garancia nem vonatkozik a Megbízó által elvégzett módosításokból eredő hibákra.

8. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott üzleti és személyes adatokat titkosan kezelik, és azokat harmadik személynek nem adják át.

9. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv vonatkozó rendelkezései az irányadók. Felek jogvitáikat elsősorban tárgyalás útján kísérlik meg rendezni.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott$TPL1$
WHERE name = 'Weboldal fejlesztési szerződés';

-- 6. Update template: Havidíjas karbantartási szerződés
UPDATE document_templates SET content = $TPL2$HAVIDÍJAS KARBANTARTÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}} ({{business_type}})
Márkanév: {{company_brand}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}
Weboldal: {{company_website}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja a Megbízó weboldalának és digitális rendszereinek rendszeres karbantartását.

Karbantartási csomag: {{maintenance_package}}
Ellátandó feladatok: {{project_description}}

2. DÍJAZÁS

Havi karbantartási díj: {{offer_price}} Ft/hó

{{aam_note}}

Számlázás gyakorisága: {{billing_frequency}}
Fizetési határidő: {{payment_terms}}

3. A SZERZŐDÉS IDŐTARTAMA

A szerződés kezdete: {{contract_start}}
Időtartam: {{contract_duration}}

Felmondási idő: {{termination_period}}

4. KARBANTARTÁS TARTALMA

A havidíjas csomag tartalmazza:
- CMS / rendszerfrissítések havonta
- Biztonsági mentések heti rendszerességgel
- Rendelkezésre állás figyelés
- Tartalomfrissítések: {{included_hours}}
- E-mail alapú technikai támogatás

5. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott adatokat bizalmasan kezelik.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott$TPL2$
WHERE name = 'Havidíjas karbantartási szerződés';

-- 7. Update template: Webshop fejlesztési szerződés
UPDATE document_templates SET content = $TPL3$WEBSHOP FEJLESZTÉSI SZERZŐDÉS

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
{{company_name}} ({{business_type}})
Márkanév: {{company_brand}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}
Weboldal: {{company_website}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja az alábbi webshop fejlesztését és üzembe helyezését:

Projekt neve: {{project_name}}
Fejlesztés tartalma: {{project_description}}

A fejlesztés magában foglalja:
- Webshop tervezése és fejlesztése
- Termékek/kategóriák felállítása (max. {{product_count}})
- Fizetési módok: {{payment_methods}}
- Szállítási módok: {{shipping_methods}}
- Integrációk: {{integrations}}
- Admin felület oktatás

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

Vállalási díj: {{offer_price}} Ft

{{aam_note}}

Fizetési feltételek: {{payment_terms}}

3. TELJESÍTÉSI HATÁRIDŐ

{{deadline}}

4. SZELLEMI TULAJDON

A projekt teljes díjának kifizetése után a webshop forráskódja és designja a Megbízó kizárólagos tulajdonába kerül.

5. GARANCIA

A Megbízott az átadást követő {{warranty}} garanciát vállal a webshop rendeltetésszerű működésére.

6. TITOKTARTÁS

Felek kötelezettséget vállalnak a bizalmas adatok megőrzésére.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott$TPL3$
WHERE name = 'Webshop fejlesztési szerződés';

-- 8. Update template: Marketing megbízási szerződés
UPDATE document_templates SET content = $TPL4$MARKETING MEGBÍZÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}} ({{business_type}})
Márkanév: {{company_brand}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}
Weboldal: {{company_website}}

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja az alábbi marketing tevékenységek elvégzését a Megbízó részére:

{{project_description}}

Hirdetési keret (külön számlázva): {{ad_budget}} Ft/hó

2. DÍJAZÁS

Havi megbízási díj: {{offer_price}} Ft/hó

{{aam_note}}

Fizetési feltételek: {{payment_terms}}
Szerződés kezdete: {{contract_start}}

3. RIPORT ÉS KOMMUNIKÁCIÓ

A Megbízott {{report_frequency}} riportot küld az eredményekről a Megbízó részére.

4. A SZERZŐDÉS IDŐTARTAMA ÉS FELMONDÁSA

A szerződés határozatlan időre szól. Mindkét fél {{termination_period}} felmondási idővel, írásban mondhatja fel.

5. TITOKTARTÁS ÉS ADATVÉDELEM

A Megbízott köteles a Megbízó üzleti adatait, ügyfeleit és stratégiáját bizalmasan kezelni.

---

Kelt: {{contract_date}}


_________________________________          _________________________________
{{client_name}}                             {{company_rep}}
Megbízó                                     Megbízott$TPL4$
WHERE name = 'Marketing megbízási szerződés';

-- 9. Update template: Általános megbízási szerződés
UPDATE document_templates SET content = $TPL5$MEGBÍZÁSI SZERZŐDÉS

Kelt: {{contract_date}}

MEGBÍZÓ (a továbbiakban: Megbízó):
Cégnév / Név: {{client_company}}
Kapcsolattartó: {{client_name}}
Adószám: {{client_tax}}
Cím: {{client_address}}
E-mail: {{client_email}}
Telefon: {{client_phone}}

MEGBÍZOTT (a továbbiakban: Megbízott):
{{company_name}} ({{business_type}})
Márkanév: {{company_brand}}
Adószám: {{company_tax}}
Székhely: {{company_address}}
E-mail: {{company_email}}
Telefon: {{company_phone}}
Weboldal: {{company_website}}

---

1. A SZERZŐDÉS TÁRGYA

Megbízás tárgya: {{project_name}}

{{project_description}}

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

Egyszeri megbízási díj: {{offer_price}} Ft

{{aam_note}}

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
Megbízó                                     Megbízott$TPL5$
WHERE name = 'Általános megbízási szerződés';
