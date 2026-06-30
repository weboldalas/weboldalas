export type ContractTemplate = {
  id: string
  label: string
  description: string
  generate: (data: ContractData) => string
}

export type ContractData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  offerTitle: string
  offerAmount: string
  offerItems: string
  date: string
  companyName: string
}

const DEFAULT_COMPANY = 'Weboldalas.hu Kft.'

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'weboldal_fejlesztes',
    label: 'Weboldal fejlesztési szerződés',
    description: 'Egyedi weboldal tervezés és fejlesztés',
    generate: (data) => `WEBOLDAL FEJLESZTÉSI SZERZŐDÉS

Kelt: ${formatDate(data.date)}

MEGBÍZÓ:
Név: ${data.customerName}
E-mail: ${data.customerEmail || '—'}
Telefon: ${data.customerPhone || '—'}
Cím: ${data.customerAddress || '—'}

MEGBÍZOTT:
${DEFAULT_COMPANY}
Web: weboldalas.hu

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja ${data.offerTitle || 'egyedi weboldal'} tervezését és fejlesztését a Megbízó részére, a jelen szerződésben foglalt feltételek szerint.

A megrendelt munkák:
${data.offerItems || '—'}

2. DÍJAZÁS ÉS FIZETÉSI FELTÉTELEK

A megbízási díj összege: ${data.offerAmount} Ft + ÁFA

Fizetési ütemezés:
- 50% előleg a szerződés aláírásakor
- 50% végszámla a projekt átadásakor

3. TELJESÍTÉSI HATÁRIDŐ

A Megbízott az elkészült munkát a szerződés aláírásától számított 30 (harminc) munkanapon belül adja át a Megbízónak, kivéve, ha a felek eltérően állapodnak meg.

4. A MEGBÍZÓ KÖTELEZETTSÉGEI

A Megbízó köteles:
- az elvégzendő munkához szükséges anyagokat, tartalmakat, hozzáféréseket időben rendelkezésre bocsátani,
- a Megbízott kérdéseire és visszajelzéseire 5 munkanapon belül reagálni.

5. A MEGBÍZOTT KÖTELEZETTSÉGEI

A Megbízott köteles:
- a vállalt munkát határidőre, szakszerűen elvégezni,
- a Megbízót a munka előrehaladásáról rendszeresen tájékoztatni,
- a Megbízó üzleti titkait megőrizni.

6. SZELLEMI TULAJDON

A projekt teljes díjának megfizetése után a weboldal forráskódja és vizuális elemei a Megbízó tulajdonába kerülnek.

7. GARANCIA

A Megbízott az átadást követő 30 napban garanciát vállal a weboldal hibamentes működésére. A garancia nem vonatkozik a Megbízó által elvégzett módosításokból eredő hibákra.

8. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott üzleti és személyes adatokat titkosan kezelik.

9. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv rendelkezései az irányadók. A felek jogvitáikat elsősorban tárgyalás útján kísérlik meg rendezni.

---

Alulírottak a jelen szerződést elolvasták, megértették és mint akaratukkal mindenben megegyezőt, jóváhagyólag írják alá.

Kelt: ${formatDate(data.date)}


_________________________________          _________________________________
${data.customerName}                        ${DEFAULT_COMPANY}
Megbízó                                     Megbízott
`,
  },
  {
    id: 'havidijas_karbantartas',
    label: 'Havidíjas karbantartási szerződés',
    description: 'Rendszeres havi weboldal karbantartás és üzemeltetés',
    generate: (data) => `HAVIDÍJAS KARBANTARTÁSI SZERZŐDÉS

Kelt: ${formatDate(data.date)}

MEGBÍZÓ:
Név: ${data.customerName}
E-mail: ${data.customerEmail || '—'}
Telefon: ${data.customerPhone || '—'}
Cím: ${data.customerAddress || '—'}

MEGBÍZOTT:
${DEFAULT_COMPANY}
Web: weboldalas.hu

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja a Megbízó weboldalának rendszeres karbantartását és üzemeltetési támogatását az alábbi feltételekkel.

Elvégzendő feladatok:
${data.offerItems || '— Weboldal frissítések, biztonság, tartalom'}

2. DÍJAZÁS

Havi karbantartási díj: ${data.offerAmount} Ft/hó + ÁFA

A díj minden hónap 1-jén esedékes, átutalással fizetendő.

3. A SZERZŐDÉS IDŐTARTAMA

A szerződés határozatlan időre szól, és mindkét fél 30 (harminc) napos felmondási idővel, írásban mondhatja fel.

4. KARBANTARTÁS TARTALMA

A havidíjas csomag tartalmazza:
- WordPress / CMS frissítések (havonta)
- Biztonsági mentések
- Rendelkezésre állás figyelés
- Kisebb tartalomfrissítések (max. 2 óra/hó)
- E-mail alapú technikai támogatás

5. A MEGBÍZÓ KÖTELEZETTSÉGEI

A Megbízó köteles:
- a havi díjat határidőre megfizetni,
- a szükséges hozzáféréseket (admin, FTP, hosting) biztosítani.

6. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződés teljesítése során tudomásukra jutott adatokat titkosan kezelik.

7. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv rendelkezései az irányadók.

---

Kelt: ${formatDate(data.date)}


_________________________________          _________________________________
${data.customerName}                        ${DEFAULT_COMPANY}
Megbízó                                     Megbízott
`,
  },
  {
    id: 'altalanos_megbizasi',
    label: 'Általános megbízási szerződés',
    description: 'Egyéb digitális marketing / IT megbízáshoz',
    generate: (data) => `MEGBÍZÁSI SZERZŐDÉS

Kelt: ${formatDate(data.date)}

MEGBÍZÓ:
Név: ${data.customerName}
E-mail: ${data.customerEmail || '—'}
Telefon: ${data.customerPhone || '—'}
Cím: ${data.customerAddress || '—'}

MEGBÍZOTT:
${DEFAULT_COMPANY}
Web: weboldalas.hu

---

1. A SZERZŐDÉS TÁRGYA

A Megbízott vállalja az alábbi feladatok elvégzését:

${data.offerTitle || 'Meghatározandó feladatok'}

Részletes munkák:
${data.offerItems || '—'}

2. DÍJAZÁS

Megbízási díj: ${data.offerAmount} Ft + ÁFA

Fizetési határidő: a teljesítéstől számított 8 nap.

3. TELJESÍTÉSI HATÁRIDŐ

A Megbízott a feladatokat a szerződés aláírásától számított 30 munkanapon belül teljesíti.

4. FELEK KÖTELEZETTSÉGEI

A Megbízott köteles a vállalt munkát szakszerűen és határidőre elvégezni.
A Megbízó köteles az elvégzett munkáért a díjat megfizetni.

5. TITOKTARTÁS

Felek kötelezettséget vállalnak arra, hogy a szerződéses jogviszonyból tudomásukra jutott adatokat bizalmasan kezelik.

6. VEGYES RENDELKEZÉSEK

Jelen szerződésre a Magyar Polgári Törvénykönyv rendelkezései az irányadók.

---

Kelt: ${formatDate(data.date)}


_________________________________          _________________________________
${data.customerName}                        ${DEFAULT_COMPANY}
Megbízó                                     Megbízott
`,
  },
]

export function getTemplate(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find(t => t.id === id)
}
