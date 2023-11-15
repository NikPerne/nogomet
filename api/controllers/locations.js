const mongoose = require("mongoose");
const Location = mongoose.model("Location");

const allowedCodelists = [
  "category",
  "type",
  "keywords",
  "institution",
  "municipality",
  "fields",
];

/**
 * @openapi
 *  /locations/distance:
 *   get:
 *    summary: Retrieve locations within a given distance.
 *    description: Retrieve **cultural heritages within a given distance** from a given location.
 *    tags: [Locations]
 *    parameters:
 *     - name: lat
 *       in: query
 *       required: true
 *       description: <b>latitude</b> of the location
 *       schema:
 *        type: number
 *        minimum: -180
 *        maximum: 180
 *       example: 46.050129
 *     - name: lng
 *       in: query
 *       required: true
 *       description: <b>longitude</b> of the location
 *       schema:
 *        type: number
 *        minimum: -90
 *        maximum: 90
 *       example: 14.469027
 *     - name: distance
 *       in: query
 *       schema:
 *        type: number
 *        minimum: 0
 *        default: 5
 *       description: maximum <b>distance</b> in kilometers
 *     - name: nResults
 *       in: query
 *       schema:
 *        type: integer
 *        minimum: 1
 *        default: 10
 *       description: maximum <b>number of results</b>
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with list of locations.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Location'
 *        example:
 *         - _id: 635a62f5dc5d7968e68467e3
 *           name: Ljubljana - Cankarjeva spominska soba na Rožniku
 *           category: spominski objekti in kraji
 *           type: memorialna dediščina
 *           keywords: spominska soba
 *           description: Spominska soba, posvečena Ivanu Cankarju, je bila urejena leta 1948 in prenovljena v letih 1965 in 1998. Pisatelj je na Rožniku živel v letih 1910 - 1917, muzejsko postavitev je pripravil Mestni muzej Ljubljana.
 *           location: Spominska soba je urejena v stavbi, ki stoji nasproti gostilne Rožnik, na Cankarjevem vrhu (Rožnik).
 *           institution: ZVKD Ljubljana
 *           heritage: neznano
 *           municipality: LJUBLJANA
 *           coordinates: [14.4765778196, 46.0557820208]
 *           synonyms: [Cankarjev vrh]
 *           datation: 20. stol., 1948, 1965, 1998
 *           authors: Mestni muzej Ljubljana (arhitekt; 1948)
 *           fields: [zgodovina]
 *           distance: 858.0692052049162
 *     '400':
 *      description: <b>Bad Request</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Query parameters 'lng' and 'lat' are required"
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "No locations found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "geo near accepts just one argument when querying for a GeoJSON point. Extra field found: $maxDistance: 5000.0"
 */
const locationsListByDistance = async (req, res) => {
  let lng = parseFloat(req.query.lng);
  let lat = parseFloat(req.query.lat);
  let distance = parseFloat(req.query.maxDistance);
  distance = 1000 * (isNaN(distance) ? 5 : distance);
  let nResults = parseInt(req.query.nResults);
  nResults = isNaN(nResults) ? 10 : nResults;
  if (!lng || !lat)
    res
      .status(400)
      .json({ message: "Query parameters 'lng' and 'lat' are required." });
  else {
    try {
      let locations = await Location.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: distance,
          },
        },
        { $project: { comments: false, id: false } },
        { $limit: nResults },
      ]);
      if (!locations || locations.length == 0)
        res.status(404).json({ message: "No locations found." });
      else res.status(200).json(locations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 * /locations/search:
 *   get:
 *    summary: Retrieve locations filtered by codelist values.
 *    description: Retrieve **cultural heritages limited with** selected **codelist's values**.
 *    tags: [Locations]
 *    parameters:
 *     - name: category
 *       in: query
 *       description: <b>category</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - arheološka najdišča
 *         - drugi objekti in naprave
 *         - kulturna krajina
 *         - naselja in njihovi deli
 *         - ostalo,parki in vrtovi
 *         - spominski objekti in kraji
 *         - stavbe,stavbe s parki ali z vrtovi
 *     - name: type
 *       in: query
 *       description: <b>type</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - arheološka dediščina
 *         - kulturna krajina
 *         - memorialna dediščina
 *         - naselbinska dediščina
 *         - ostalo,profana stavbna dediščina
 *         - sakralna stavbna dediščina
 *         - sakralno profana stavbna ded.
 *         - vrtnoarhitekturna dediščina
 *         - zgodovinska krajina
 *     - name: keywords
 *       in: query
 *       description: <b>keywords</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - Božji grob
 *         - Brezmadežno spočetje Device Marije
 *         - Devica Marija
 *         - Devica Marija na Pesku
 *         - Devica Marija pomočnica
 *         - Devica Marija v Britofu
 *         - Ecce homo
 *         - Gospodov vnebohod
 *         - Ime Marijino
 *         - Kancianila in Prot
 *         - Kancijan
 *         - Karmelska Mati božja
 *         - Kristusovo učlovečenje
 *         - Lurška Mati božja
 *         - Marija Alietska
 *         - Marija Devica Tolažnica žalostnih
 *         - Marija Pomočnica
 *         - Marija Snežna
 *         - Marija sedem žalosti
 *         - Marija vnebovzeta
 *         - Marijino Vnebovzetje
 *         - Marijino obiskanje
 *         - Marijino obiskovanje
 *         - Marijino oznanjenje
 *         - Marijino prikazovanje
 *         - Marijino rojstvo
 *         - Marijino vnebovzetje
 *         - Mati božja
 *         - Mati božja Tolažnica žalostnih
 *         - Mati božja dobrega sveta
 *         - Poveličanje sv. Križa
 *         - Rojstvo Device Marije
 *         - Rožnovenska Mati božja
 *         - Srce Jezusovo
 *         - Vsi svetniki
 *         - alpinetum
 *         - ambient
 *         - apnenica
 *         - arboretum
 *         - arheološki park
 *         - arheološko najdišče
 *         - arheološko območje
 *         - arhitekturna plastika
 *         - arkade
 *         - arkadno dvorišče
 *         - bajta
 *         - baldahin
 *         - banka
 *         - baraka
 *         - bazen
 *         - bencinska črpalka
 *         - bolnišnica
 *         - botanični vrt
 *         - brežina
 *         - brunarica
 *         - bunker
 *         - castra
 *         - cerkev
 *         - cesta
 *         - cisterna
 *         - deblak
 *         - delavska hiša
 *         - delavska kolonija
 *         - delavski dom
 *         - depandansa
 *         - dimnica
 *         - dimnik
 *         - divji kostanj
 *         - dom pomembne osebnosti
 *         - dom za onemogle
 *         - domačija
 *         - domačija na ključ
 *         - domačija na vogel
 *         - donžon
 *         - doprsje
 *         - drevo
 *         - drevored
 *         - drvarnica
 *         - dvigalo
 *         - dvojni kozolec
 *         - dvojni kozolec*
 *         - dvor
 *         - dvorana
 *         - dvorec
 *         - dvorec s parkom
 *         - dvorec z vrtom
 *         - dvorišče
 *         - dvorišče
 *         - elektrarna
 *         - enojni kozolec
 *         - evangeličanska cerkev
 *         - faladur
 *         - figuralno znamenje
 *         - fotoatelje
 *         - frančiškanski samostan
 *         - freska
 *         - furmanska gostilna
 *         - fužinarska hiša
 *         - fužinarsko naselje
 *         - gaj
 *         - galerija
 *         - galerija na prostem
 *         - gank
 *         - garaža
 *         - garderoba
 *         - gartlc
 *         - gledališče
 *         - golobnjak
 *         - gomila
 *         - gomilno grobišče
 *         - gospodarsko poslopje
 *         - gostilna
 *         - gostinski vrt
 *         - gozdarska žičnica
 *         - grad
 *         - grad s parkom
 *         - grad z vrtom
 *         - gradišče
 *         - grajska kapela
 *         - grajska pristava
 *         - grajski vrt
 *         - graščina
 *         - grob
 *         - grob pomembne osebnosti
 *         - grobišče
 *         - grobna kapela
 *         - grobni oltar
 *         - grobnica
 *         - gručasta domačija
 *         - gručasta vas
 *         - hidroelektrarna
 *         - hiša
 *         - hišno drevo
 *         - hlev
 *         - hospic
 *         - hotel
 *         - hram
 *         - internat
 *         - inštitut
 *         - izvir
 *         - jahalnica
 *         - jama
 *         - jamska postojanka
 *         - jamsko najdišče
 *         - javni spomenik
 *         - javni vodnjak
 *         - jašek
 *         - jez
 *         - kajža
 *         - kal
 *         - kalvarija
 *         - kamnit most
 *         - kamniti križ
 *         - kamniti most
 *         - kamnolom
 *         - kanoniška hiša
 *         - kapela
 *         - kapelica
 *         - kaplanija
 *         - kartuzijanski samostan
 *         - kastel
 *         - kavarna
 *         - kaverna
 *         - kašča
 *         - kegljišče
 *         - kenotaf
 *         - kino
 *         - kip
 *         - klavnica
 *         - klet
 *         - kmetija
 *         - kmečka hiša
 *         - kmečki dvorec
 *         - knjižnica
 *         - kobilarna
 *         - kolišče
 *         - komenda
 *         - komunska kašča
 *         - komunski vodnjak
 *         - koncentracijsko taborišče
 *         - kondenzator
 *         - konjušnica
 *         - kopališče
 *         - koruznjak
 *         - kostnica
 *         - kovačija
 *         - kovnica
 *         - kozolec
 *         - kozolec na psa
 *         - kozolec s plaščem
 *         - koča
 *         - kraj zgodovinskega dogodka
 *         - kripta
 *         - križev pot
 *         - krstilnica
 *         - kuhinja z ognjiščem
 *         - kulturna krajina
 *         - kulturni dom
 *         - kužno znamenje
 *         - laboratorij
 *         - ladja
 *         - lapidarij
 *         - ledenica
 *         - lekarna
 *         - leseni zvonik
 *         - letalo
 *         - letni dvorec
 *         - letno gledališče
 *         - lipa
 *         - logarnica
 *         - lokacija
 *         - lopa
 *         - lovska postaja
 *         - lovski dvorec
 *         - loža
 *         - marof
 *         - mavzolej
 *         - mejnik
 *         - mestna hiša
 *         - mestna kašča
 *         - mestna palača
 *         - mestna vrata
 *         - mestna četrt
 *         - mestni grad
 *         - mestni park
 *         - mestno jedro
 *         - mestno obzidje
 *         - meščanska hiša
 *         - meščanska palača
 *         - mežnarija
 *         - miljnik
 *         - minoritski samostan
 *         - mitnica
 *         - mitrej
 *         - mizarska delavnica
 *         - mlin
 *         - mlinska hiša
 *         - mlinščica
 *         - molilnica
 *         - most
 *         - mostovž
 *         - mozaik
 *         - mrliška vežica
 *         - mulatiera
 *         - muzej
 *         - muzej na prostem
 *         - nagrobna plošča
 *         - nagrobnik
 *         - napajalno korito
 *         - narodni dom
 *         - naselbina
 *         - naselje
 *         - nekropola
 *         - nizki kozolec
 *         - niša
 *         - njiva
 *         - obcestna postaja
 *         - obcestna vas
 *         - obloženi grob
 *         - obrambni stolp
 *         - obrambni zid
 *         - obredni depo
 *         - obrtniška hiša
 *         - obzidje
 *         - ograja
 *         - oktogon
 *         - oljarna
 *         - oltar
 *         - opekarna
 *         - orgle
 *         - ovčja planina
 *         - palača
 *         - park
 *         - parkovna plastika
 *         - partizanska bolnišnica
 *         - partizanska tiskarna
 *         - pastirska bajta
 *         - paviljon
 *         - pašnik
 *         - pepelnica
 *         - perišče
 *         - peč
 *         - pil
 *         - pivovarna
 *         - planina
 *         - planinski dom
 *         - plano grobišče
 *         - planšarsko naselje
 *         - plavž
 *         - pod
 *         - podružnična cerkev
 *         - pokopališka cerkev
 *         - pokopališka kapela
 *         - pokopališki zid
 *         - pokopališče
 *         - portal
 *         - posamična najdba
 *         - poslikava
 *         - poslovna stavba
 *         - postaja
 *         - pot
 *         - počivališče
 *         - poštna postaja
 *         - pravoslavna cerkev
 *         - predmestje
 *         - predmestna hiša
 *         - predor
 *         - preužitkarska hiša
 *         - preša
 *         - pristanišče
 *         - pristava
 *         - proštija
 *         - rake
 *         - rastlinjak
 *         - razgledni stolp
 *         - razložena vas
 *         - razpelo
 *         - razstavišče
 *         - razvalina
 *         - refugij
 *         - relief
 *         - repnica
 *         - restavracija
 *         - ribnik
 *         - romarska cerkev
 *         - romarska hiša
 *         - romarsko središče
 *         - rotunda
 *         - rudarska hiša
 *         - rudnik
 *         - rudniška kapela
 *         - ruševina
 *         - sadovnjak
 *         - samostan
 *         - samostanska cerkev
 *         - samostanski vrt
 *         - sarkofag
 *         - senik
 *         - shramba
 *         - silos
 *         - sinagoga
 *         - sirarna
 *         - skedenj
 *         - skeletni pokop
 *         - skladišče
 *         - skrivni bunker
 *         - slopno znamenje
 *         - sodišče
 *         - sokolski dom
 *         - soline
 *         - solinska hiša
 *         - sončna ura
 *         - spahnjenca
 *         - spahnjenica
 *         - spominska hiša
 *         - spominska plošča
 *         - spominska soba
 *         - spominska tabla
 *         - spominski park
 *         - spominsko znamenje
 *         - sprehajalna pot
 *         - sramotilni steber
 *         - srednjeveško mesto
 *         - stadion
 *         - staja
 *         - stan
 *         - stanovanjska četrt
 *         - stanovanjski blok
 *         - stavba
 *         - steber
 *         - stebrno znamenje
 *         - stegnjena domačija
 *         - steklarska peč
 *         - steljnik
 *         - stolnica
 *         - stolp
 *         - stolpna ura
 *         - stolpnica
 *         - stopnišče
 *         - stražni stolp
 *         - strelišče
 *         - strelski jarek
 *         - stroj
 *         - strojnica
 *         - struga
 *         - suho stranišče
 *         - sušilnica
 *         - sušilnica za sadje
 *         - sv. Ahac
 *         - sv. Alojzij
 *         - sv. Ambrož
 *         - sv. Ana
 *         - sv. Andrej
 *         - sv. Anton Padovanski
 *         - sv. Avguštin
 *         - sv. Barbara
 *         - sv. Benedikt
 *         - sv. Bolfenk
 *         - sv. Boštjan
 *         - sv. Brikcij
 *         - sv. Ciril in Metod
 *         - sv. Danijel
 *         - sv. Donat
 *         - sv. Doroteja
 *         - sv. Družina
 *         - sv. Duh
 *         - sv. Egidij
 *         - sv. Elizabeta
 *         - sv. Fabijan
 *         - sv. Fabijan in Sebastijan
 *         - sv. Filip in Jakob
 *         - sv. Florijan
 *         - sv. Frančišek Asiški
 *         - sv. Frančišek Ksaverij
 *         - sv. Gervazij in Protazij
 *         - sv. Helena
 *         - sv. Ingenuin in Albuin
 *         - sv. Jakob
 *         - sv. Jakob starejši
 *         - sv. Janez Krstnik
 *         - sv. Janez Nepomuk
 *         - sv. Jedrt
 *         - sv. Jernej
 *         - sv. Jošt
 *         - sv. Jožef
 *         - sv. Jurij
 *         - sv. Just
 *         - sv. Kancij
 *         - sv. Kancijan
 *         - sv. Katarina
 *         - sv. Kozma in Damijan
 *         - sv. Križ
 *         - sv. Ladislav
 *         - sv. Lenart
 *         - sv. Lenart in sv. Rok
 *         - sv. Lovrenc
 *         - sv. Lucija
 *         - sv. Luka
 *         - sv. Marija
 *         - sv. Marija Zvezda
 *         - sv. Marjeta
 *         - sv. Marko
 *         - sv. Martin
 *         - sv. Matevž
 *         - sv. Matija
 *         - sv. Maver
 *         - sv. Mavricij
 *         - sv. Mihael
 *         - sv. Miklavž
 *         - sv. Mohor in Fortunat
 *         - sv. Neža
 *         - sv. Nikolaj
 *         - sv. Ožbolt
 *         - sv. Pavel
 *         - sv. Peter
 *         - sv. Peter in Pavel
 *         - sv. Primož
 *         - sv. Primož in Felicijan
 *         - sv. Radegunda
 *         - sv. Rok
 *         - sv. Rok in Sebastijan
 *         - sv. Rozalija
 *         - sv. Rupert
 *         - sv. Silvester
 *         - sv. Simon in Juda
 *         - sv. Simon in Juda Tadej
 *         - sv. Tilen
 *         - sv. Tomaž
 *         - sv. Trije kralji
 *         - sv. Trojica
 *         - sv. Urban
 *         - sv. Urh
 *         - sv. Uršula
 *         - sv. Valentin
 *         - sv. Vid
 *         - sv. Vladimir
 *         - sv. Volbenk
 *         - sv. Štefan
 *         - svete stopnice
 *         - svetišče
 *         - svinjak
 *         - tabor
 *         - talilna peč
 *         - talilnica
 *         - telovadnica
 *         - tempelj
 *         - terase
 *         - terme
 *         - termoelektrarna
 *         - tiskarna
 *         - toplar
 *         - tovarna
 *         - trafika
 *         - transformatorska postaja
 *         - travnik
 *         - trg
 *         - trgovina
 *         - trška hiša
 *         - trško jedro
 *         - trško naselje
 *         - tržnica
 *         - ulica
 *         - ulični otok
 *         - uta
 *         - utrdba
 *         - vas
 *         - vaško jedro
 *         - veleblagovnica
 *         - vila
 *         - villa rustica
 *         - viničarija
 *         - vinogradniški dvorec
 *         - vinogradniški zaselek
 *         - vinska klet
 *         - vislice
 *         - viteški nagrobnik
 *         - vodna žaga
 *         - vodni grad
 *         - vodni mlin
 *         - vodni stolp
 *         - vodni zbiralnik
 *         - vodnjak
 *         - vodomet
 *         - vojaški tabor
 *         - vojaško pokopališče
 *         - vojašnica
 *         - vratarnica
 *         - vrhhlevna hiša
 *         - vrhkletna hiša
 *         - vrt
 *         - vrtec
 *         - vrtna plastika
 *         - vrtnarija
 *         - vrtni rondo
 *         - vzporedna domačija
 *         - vzporedni kozolec
 *         - zaledna postojanka
 *         - zapor
 *         - zaporni zid
 *         - zapornica
 *         - zaprta domačija
 *         - zaselek
 *         - zbirka predmetov
 *         - zdraviliški objekt
 *         - zdraviliški park
 *         - zdravilišče
 *         - zidanica
 *         - zlati oltar
 *         - znamenje
 *         - znamenje z nišo
 *         - zvonik
 *         - zvončnica
 *         - čebelnjak
 *         - čolnarna
 *         - črna kuhinja
 *         - čuvajnica
 *         - šola
 *         - špital
 *         - Žalostna Mati božja
 *         - žaga
 *         - žara
 *         - železarna
 *         - železniška postaja
 *         - železniška proga
 *         - železobetonski most
 *         - žgani pokop
 *         - žitnica
 *         - živica
 *         - žičnica
 *         - župnijska cerkev
 *         - župnijsko središče
 *         - župnišče
 *     - name: institution
 *       in: query
 *       description: <b>institution</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - ZVKD Celje
 *         - ZVKD Kranj
 *         - ZVKD Ljubljana
 *         - ZVKD Maribor
 *         - ZVKD Nova Gorica
 *         - ZVKD Novo mesto
 *         - ZVKD Piran
 *     - name: municipality
 *       in: query
 *       description: <b>municipality</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - AJDOVŠČINA
 *         - ANKARAN
 *         - APAČE
 *         - BELTINCI
 *         - BENEDIKT
 *         - BISTRICA OB SOTLI
 *         - BLED
 *         - BOHINJ
 *         - BOROVNICA
 *         - BOVEC
 *         - BRASLOVČE
 *         - BRDA
 *         - BREZOVICA
 *         - BREŽICE
 *         - CANKOVA
 *         - CELJE
 *         - CERKLJE NA GORENJSKEM
 *         - CERKNICA
 *         - CERKNO
 *         - CERKVENJAK
 *         - CIRKULANE
 *         - DESTRNIK
 *         - DIVAČA
 *         - DOBJE
 *         - DOBREPOLJE
 *         - DOBRNA
 *         - DOBROVA-POLHOV GRADEC
 *         - DOBROVNIK
 *         - DOL PRI LJUBLJANI
 *         - DOLENJSKE TOPLICE
 *         - DOMŽALE
 *         - DORNAVA
 *         - DRAVOGRAD
 *         - DUPLEK
 *         - GORENJA VAS-POLJANE
 *         - GORIŠNICA
 *         - GORJE
 *         - GORNJA RADGONA
 *         - GORNJI GRAD
 *         - GORNJI PETROVCI
 *         - GRAD
 *         - GROSUPLJE
 *         - HAJDINA
 *         - HORJUL
 *         - HOČE-SLIVNICA
 *         - HRASTNIK
 *         - HRPELJE-KOZINA
 *         - IDRIJA
 *         - IG
 *         - ILIRSKA BISTRICA
 *         - IVANČNA GORICA
 *         - IZOLA
 *         - JESENICE
 *         - JEZERSKO
 *         - JURŠINCI
 *         - KAMNIK
 *         - KANAL
 *         - KIDRIČEVO
 *         - KOBARID
 *         - KOBILJE
 *         - KOMEN
 *         - KOMENDA
 *         - KOPER
 *         - KOSTANJEVICA NA KRKI
 *         - KOSTEL
 *         - KOZJE
 *         - KOČEVJE
 *         - KRANJ
 *         - KRANJSKA GORA
 *         - KRIŽEVCI
 *         - KRŠKO
 *         - KUNGOTA
 *         - KUZMA
 *         - LAŠKO
 *         - LENART
 *         - LENDAVA
 *         - LITIJA
 *         - LJUBLJANA
 *         - LJUBNO
 *         - LJUTOMER
 *         - LOGATEC
 *         - LOVRENC NA POHORJU
 *         - LOŠKA DOLINA
 *         - LOŠKI POTOK
 *         - LUKOVICA
 *         - LUČE
 *         - MAJŠPERK
 *         - MAKOLE
 *         - MARIBOR
 *         - MEDVODE
 *         - MENGEŠ
 *         - METLIKA
 *         - MEŽICA
 *         - MIKLAVŽ NA DRAVSKEM POLJU
 *         - MIREN-KOSTANJEVICA
 *         - MIRNA
 *         - MIRNA PEČ
 *         - MISLINJA
 *         - MOKRONOG-TREBELNO
 *         - MORAVSKE TOPLICE
 *         - MORAVČE
 *         - MOZIRJE
 *         - MURSKA SOBOTA
 *         - MUTA
 *         - NAKLO
 *         - NAZARJE
 *         - NOVA GORICA
 *         - NOVO MESTO
 *         - OPLOTNICA
 *         - ORMOŽ
 *         - OSILNICA
 *         - PESNICA
 *         - PIRAN
 *         - PIVKA
 *         - PODLEHNIK
 *         - PODVELKA
 *         - PODČETRTEK
 *         - POLJČANE
 *         - POLZELA
 *         - POSTOJNA
 *         - PREBOLD
 *         - PREDDVOR
 *         - PREVALJE
 *         - PTUJ
 *         - PUCONCI
 *         - RADENCI
 *         - RADEČE
 *         - RADLJE OB DRAVI
 *         - RADOVLJICA
 *         - RAVNE NA KOROŠKEM
 *         - RAZKRIŽJE
 *         - RAČE-FRAM
 *         - RENČE-VOGRSKO
 *         - REČICA OB SAVINJI
 *         - RIBNICA
 *         - RIBNICA NA POHORJU
 *         - ROGATEC
 *         - ROGAŠKA SLATINA
 *         - ROGAŠOVCI
 *         - RUŠE
 *         - SELNICA OB DRAVI
 *         - SEMIČ
 *         - SEVNICA
 *         - SEŽANA
 *         - SLOVENJ GRADEC
 *         - SLOVENSKA BISTRICA
 *         - SLOVENSKE KONJICE
 *         - SOLČAVA
 *         - SREDIŠČE OB DRAVI
 *         - STRAŽA
 *         - SV. TROJICA V SLOV. GORICAH
 *         - SVETA ANA
 *         - SVETI ANDRAŽ V SLOV. GORICAH
 *         - SVETI JURIJ OB ŠČAVNICI
 *         - SVETI JURIJ V SLOV. GORICAH
 *         - SVETI TOMAŽ
 *         - TIŠINA
 *         - TOLMIN
 *         - TRBOVLJE
 *         - TREBNJE
 *         - TRŽIČ
 *         - TURNIŠČE
 *         - VELENJE
 *         - VELIKE LAŠČE
 *         - VERŽEJ
 *         - VIDEM
 *         - VIPAVA
 *         - VITANJE
 *         - VODICE
 *         - VOJNIK
 *         - VRANSKO
 *         - VRHNIKA
 *         - VUZENICA
 *         - ZAGORJE OB SAVI
 *         - ZREČE
 *         - ČRENŠOVCI
 *         - ČRNA NA KOROŠKEM
 *         - ČRNOMELJ
 *         - ŠALOVCI
 *         - ŠEMPETER-VRTOJBA
 *         - ŠENTILJ
 *         - ŠENTJERNEJ
 *         - ŠENTJUR
 *         - ŠENTRUPERT
 *         - ŠENČUR
 *         - ŠKOCJAN
 *         - ŠKOFJA LOKA
 *         - ŠMARJE PRI JELŠAH
 *         - ŠMARJEŠKE TOPLICE
 *         - ŠMARTNO OB PAKI
 *         - ŠMARTNO PRI LITIJI
 *         - ŠOŠTANJ
 *         - ŠTORE
 *         - ŽALEC
 *         - ŽELEZNIKI
 *         - ŽETALE
 *         - ŽIRI
 *         - ŽIROVNICA
 *         - ŽUŽEMBERK
 *     - name: fields
 *       in: query
 *       description: <b>fields</b> of the location
 *       schema:
 *        type: string
 *        enum:
 *         - arheologija
 *         - dendrologija
 *         - etnologija
 *         - geomorfologija
 *         - gozdarstvo
 *         - krajinska arhitektura
 *         - tehniška zgodovina
 *         - tehniška zgodovina,
 *         - umetnostna zgodovina
 *         - urbanistična zgodovina
 *         - zgodovina
 *     - name: nResults
 *       in: query
 *       schema:
 *        type: integer
 *        minimum: 1
 *        default: 10
 *       description: maximum <b>number of results</b>
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with list of locations.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Location'
 *        example:
 *         - _id: 635a62f5dc5d7968e68467e3
 *           name: Ljubljana - Cankarjeva spominska soba na Rožniku
 *           category: spominski objekti in kraji
 *           type: memorialna dediščina
 *           keywords: spominska soba
 *           description: Spominska soba, posvečena Ivanu Cankarju, je bila urejena leta 1948 in prenovljena v letih 1965 in 1998. Pisatelj je na Rožniku živel v letih 1910 - 1917, muzejsko postavitev je pripravil Mestni muzej Ljubljana.
 *           location: Spominska soba je urejena v stavbi, ki stoji nasproti gostilne Rožnik, na Cankarjevem vrhu (Rožnik).
 *           institution: ZVKD Ljubljana
 *           heritage: neznano
 *           municipality: LJUBLJANA
 *           coordinates: [14.4765778196, 46.0557820208]
 *           synonyms: [Cankarjev vrh]
 *           datation: 20. stol., 1948, 1965, 1998
 *           authors: Mestni muzej Ljubljana (arhitekt; 1948)
 *           fields: [zgodovina]
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "No locations found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "geo near accepts just one argument when querying for a GeoJSON point. Extra field found: $maxDistance: 5000.0"
 */
const locationsListByMultiFilter = async (req, res) => {
  let filter = [];
  // Exclude fields
  filter.push({ $project: { comments: false, id: false } });
  // Filter by codelist if provided
  allowedCodelists.forEach((codelist) => {
    let value = req.query[codelist];
    if (value) filter.push({ $match: { [codelist]: value } });
  });
  // Maximum number of results
  let nResults = parseInt(req.query.nResults);
  nResults = isNaN(nResults) ? 10 : nResults;
  filter.push({ $limit: nResults });
  // Perform database search and return results
  try {
    let locations = await Location.aggregate(filter).exec();
    if (!locations || locations.length === 0)
      res.status(404).json({ message: "No locations found." });
    else res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /locations/{locationId}:
 *   get:
 *    summary: Retrieve details of a given location.
 *    description: Retrieve **cultural heritage details** for a given location.
 *    tags: [Locations]
 *    parameters:
 *    - name: locationId
 *      in: path
 *      required: true
 *      description: <b>unique identifier</b> of location
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      example: 635a62f5dc5d7968e68464c1
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with location details.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Location'
 *        example:
 *         _id: 635a62f5dc5d7968e68464c1
 *         name: Šentrupert na Dolenjskem - Muzej na prostem
 *         category: stavbe
 *         type: profana stavbna dediščina
 *         keywords: [muzej na prostem,kozolec na psa,kozolec s plaščem,enojni kozolec,nizki kozolec,toplar,vzporedni kozolec]
 *         description: Muzej na prostem sestavljajo skupina 17 kozolcev različnih tipov in dve enostavni sušilni napravi (belokranjska ostrv in ribniški kozouček). Postavitev iz 2012 prikazuje genezo kozolca na Slovenskem in raznolikost kozolcev v Mirnski dolini.
 *         location: Muzej na prostem je urejen na južnem obrobju Šentruperta na Dolenjskem.
 *         institution: ZVKD Novo mesto
 *         heritage: spomenik lokalnega pomena
 *         municipality: ŠENTRUPERT
 *         coordinates: [15.0914351743,45.9748324693]
 *         datation: zadnja četrtina 18. stol., 19. stol., prva polovica 20. stol., prva četrtina 21. stol., 2012
 *         fields: [etnologija,krajinska arhitektura,tehniška zgodovina]
 *         comments: []
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Location with id '735a62f5dc5d7968e68464c1' not found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"Location\""
 */
const locationsReadOne = async (req, res) => {
  try {
    let location = await Location.findById(req.params.locationId)
      .select("-id")
      .exec();
    if (!location)
      res.status(404).json({
        message: `Location with id '${req.params.locationId}' not found`,
      });
    else res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /locations/codelist/{codelist}:
 *  get:
 *   summary: Retrieve codelist values.
 *   description: Allowed **codelist values** for given codelist name.
 *   tags: [Locations]
 *   parameters:
 *    - name: codelist
 *      in: path
 *      required: true
 *      description: codelist <b>name</b>
 *      schema:
 *       $ref: '#/components/schemas/Codelist'
 *      example: category
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with codelist values.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *       example: ["arheološka najdišča","drugi objekti in naprave","kulturna krajina","naselja in njihovi deli","ostalo","parki in vrtovi","spominski objekti in kraji","stavbe","stavbe s parki ali z vrtovi"]
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        codelist not found:
 *         value:
 *          message: "No codelist found for 'custom category'."
 *        codelist not allowed:
 *         value:
 *          message: "Parameter 'codelist must be one of: category, type, keywords, institution, municipality, fields.'"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */
const locationsListCodelist = async (req, res) => {
  let codelist = req.params.codelist;
  if (!allowedCodelists.includes(codelist))
    res.status(400).json({
      message: `Parameter 'codelist' must be one of: ${allowedCodelists.join(
        ", "
      )}`,
    });
  else {
    try {
      let codeListValues = await Location.distinct(codelist).exec();
      if (!codeListValues || codeListValues.length === 0)
        res
          .status(404)
          .json({ message: `No codelist found for '${codelist}.'` });
      else res.status(200).json(codeListValues);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = {
  locationsListByDistance,
  locationsListByMultiFilter,
  locationsListCodelist,
  locationsReadOne,
};
