export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  answerSummary: {
    handles: string;
    suitableWhen: string;
    limitation: string;
    confirmBeforeWork: string;
  };
  image: string;
  imageAlt: string;
  whatsappMessage: string;
  symptoms: string[];
  causes: string[];
  process: {
    title: string;
    description: string;
  }[];
  priceFactors: string[];
  suitableFor: string[];
  faqs: ServiceFaq[];
  relatedSlugs: string[];
}

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: "toilet-unblocking",
    name: "坐廁及馬桶通渠",
    shortName: "坐廁通渠",
    eyebrow: "TOILET UNBLOCKING",
    title: "坐廁通渠｜馬桶淤塞、倒灌處理及收費因素｜通渠熊",
    description:
      "坐廁去水慢、沖水後水位上升或馬桶倒灌？了解常見成因、通渠處理方法及影響收費的因素。可先經 WhatsApp 傳送相片或影片索取初步估價。",
    heroTitle: "坐廁淤塞、去水慢或倒灌，先判斷堵塞位置",
    heroDescription:
      "由紙巾及異物堵塞，到座廁隔氣或公共喉管問題，處理方法並不一樣。師傅會按現場情況檢查，動工前確認方案及最終收費。",
    answerSummary: {
      handles: "坐廁去水慢、完全淤塞、水位上升、倒灌及懷疑異物堵塞。",
      suitableWhen:
        "只有坐廁受影響，或需要判斷問題位於座廁、支喉還是公共喉管。",
      limitation: "硬物位置、座廁結構及公共喉管狀況，單靠相片未必能夠確認。",
      confirmBeforeWork:
        "現場檢查堵塞範圍、是否需要拆裝、處理方法及最終總收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港住宅坐廁及馬桶通渠服務",
    whatsappMessage:
      "你好，我想查詢坐廁／馬桶通渠。情況是去水慢、淤塞或倒灌，請先提供初步估價及需要拍攝的資料。",
    symptoms: [
      "沖水後水位持續上升，需要很久才回落",
      "座廁發出咕嚕聲或出現異味",
      "廁紙及污水未能正常沖走",
      "其他去水位同時變慢，可能涉及共用喉管",
    ],
    causes: [
      "大量廁紙、濕紙巾或清潔用品積聚",
      "玩具、樽蓋或其他硬物跌入座廁",
      "座廁隔氣或接駁喉管積垢",
      "大廈支渠或公共主渠出現堵塞",
    ],
    process: [
      {
        title: "了解症狀",
        description:
          "先了解水位變化、是否曾跌入異物，以及其他去水位有沒有同時受影響。",
      },
      {
        title: "檢查堵塞位置",
        description:
          "按現場情況判斷問題位於座廁、支喉還是公共喉管，避免盲目施工。",
      },
      {
        title: "確認方案及收費",
        description:
          "師傅現場檢查後說明建議方法，客戶確認最終總收費後才開始工程。",
      },
      {
        title: "通渠及測試",
        description:
          "完成疏通後反覆測試沖水及去水情況，並清理受工程影響的位置。",
      },
    ],
    priceFactors: [
      "堵塞位置及嚴重程度",
      "是否有硬物跌入或需要拆裝座廁",
      "問題屬於室內支喉還是大廈公共喉管",
      "施工時間、現場空間及所需設備",
    ],
    suitableFor: [
      "住宅坐廁完全淤塞",
      "沖水後水位上升",
      "馬桶反覆去水慢",
      "懷疑異物跌入座廁",
    ],
    faqs: [
      {
        question: "可否自行倒通渠水處理塞廁所？",
        answer:
          "不建議混合或反覆使用化學通渠劑。藥劑可能殘留在座廁或喉管內，增加灼傷及施工風險，亦未必能處理硬物堵塞。",
      },
      {
        question: "坐廁淤塞是否一定要拆馬桶？",
        answer:
          "不一定。是否需要拆裝要視乎異物位置、座廁結構及現場檢查結果。師傅會先採用合適而較少破壞的方法。",
      },
      {
        question: "為何通完不久又再次淤塞？",
        answer:
          "可能只是暫時打通局部堵塞，亦可能涉及管壁積垢、喉管斜度、硬物或公共主渠問題。反覆淤塞可考慮進一步檢查。",
      },
    ],
    relatedSlugs: [
      "bathroom-drain-unblocking",
      "sewage-backflow",
      "cctv-drain-inspection",
    ],
  },
  {
    slug: "kitchen-sink-unblocking",
    name: "廚房鋅盤通渠",
    shortName: "廚房鋅盤",
    eyebrow: "KITCHEN SINK",
    title: "廚房鋅盤通渠｜去水慢、油脂淤塞處理｜通渠熊",
    description:
      "廚房鋅盤去水慢、倒灌或有異味？了解油脂、食物殘渣及隔氣堵塞的處理方法與收費因素。可經 WhatsApp 傳送影片索取初步估價。",
    heroTitle: "鋅盤去水慢，通常不只是一小撮食物殘渣",
    heroDescription:
      "油脂會在喉管內逐層積聚，再黏住食物碎屑。若只短暫打穿一個小孔，問題容易重來；處理前應先判斷堵塞範圍。",
    answerSummary: {
      handles: "廚房鋅盤去水慢、積水、異味、咕嚕聲及反覆淤塞。",
      suitableWhen: "懷疑油脂、食物殘渣，或隔氣與去水支喉內有沉積物。",
      limitation: "牆內喉管走向及沉積範圍，通常要在現場測試後才能判斷。",
      confirmBeforeWork: "確認堵塞位置、是否拆洗隔氣、所需工具及最終總收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港廚房鋅盤去水慢及油脂淤塞通渠",
    whatsappMessage:
      "你好，我想查詢廚房鋅盤通渠。現時有去水慢、倒灌或異味問題，請先提供初步估價及需要拍攝的資料。",
    symptoms: [
      "放水後鋅盤水位逐漸上升",
      "排水時出現咕嚕聲或油膉異味",
      "洗衣機或附近去水位出現倒灌",
      "使用吸盤後短暫改善，但很快再次變慢",
    ],
    causes: [
      "煮食油、湯汁及豬油膏在管壁凝固",
      "飯粒、菜渣及咖啡渣進入去水喉",
      "鋅盤隔氣積聚油脂或接駁位變形",
      "較長的橫喉內形成大範圍油垢",
    ],
    process: [
      {
        title: "檢查去水表現",
        description:
          "觀察放水速度、倒灌位置及異味，初步判斷堵塞位於隔氣或較深入喉管。",
      },
      {
        title: "檢查接駁及隔氣",
        description: "查看鋅盤下方喉件有沒有滲漏、鬆脫、變形或明顯積聚物。",
      },
      {
        title: "選擇清理方法",
        description:
          "按油垢範圍及喉管狀況選擇機械疏通、清理隔氣或其他合適方法。",
      },
      {
        title: "放水測試",
        description: "工程後以足夠水量測試排水速度，並檢查接駁位置有沒有滲漏。",
      },
    ],
    priceFactors: [
      "堵塞位於隔氣、支喉或較長橫喉",
      "油脂硬化程度及堵塞範圍",
      "是否需要拆裝或更換老化喉件",
      "現場工作空間及所需清理設備",
    ],
    suitableFor: [
      "廚房鋅盤去水慢",
      "鋅盤排水時倒灌",
      "去水口有油膉異味",
      "油脂堵塞反覆出現",
    ],
    faqs: [
      {
        question: "用熱水沖洗能否溶走油脂？",
        answer:
          "熱水可能令近去水口的油脂短暫軟化，但油脂冷卻後可在更深入位置重新凝固，未必能清除已形成的厚油垢。",
      },
      {
        question: "鋅盤通渠後如何減少再次淤塞？",
        answer:
          "避免將煮食油及食物殘渣倒入鋅盤，使用隔渣網，並先抹走煲碟上的大量油脂才清洗。",
      },
      {
        question: "鋅盤去水慢是否可能涉及大廈主渠？",
        answer:
          "如果多個去水位同時受影響，或低層單位出現倒灌，問題可能不只在鋅盤支喉，應進一步檢查共用喉管。",
      },
    ],
    relatedSlugs: [
      "bathroom-drain-unblocking",
      "high-pressure-jetting",
      "cctv-drain-inspection",
    ],
  },
  {
    slug: "bathroom-drain-unblocking",
    name: "企缸、浴缸及浴室通渠",
    shortName: "浴室／企缸通渠",
    eyebrow: "BATHROOM DRAIN",
    title: "企缸塞、浴缸去水慢｜浴室頭髮塞渠處理｜通渠熊",
    description:
      "企缸塞、浴缸去水慢或沖涼後積水？了解頭髮、番梘垢及地台去水堵塞的常見成因、處理流程與收費因素，可經 WhatsApp 傳送影片作初步估價。",
    heroTitle: "企缸塞、浴缸去水慢，先分辨隔渣位還是喉管堵塞",
    heroDescription:
      "頭髮會與番梘垢在去水隔、隔氣及喉管內逐步積聚。若清理表面後仍然去水慢，堵塞位置可能已深入喉管，需要按現場情況處理。",
    answerSummary: {
      handles: "浴室地台、企缸或浴缸去水慢、積水、異味及倒灌。",
      suitableWhen: "懷疑頭髮、番梘垢或沉積物堵塞去水隔、隔氣與支喉。",
      limitation: "多個去水位同時受影響時，問題可能不只在表面去水隔。",
      confirmBeforeWork: "檢查受影響範圍、堵塞深度、處理方法及最終總收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港企缸、浴缸及浴室頭髮塞渠處理服務",
    whatsappMessage:
      "你好，我想查詢企缸／浴缸／浴室去水通渠。現時有去水慢或積水問題，請告訴我需要拍攝哪些資料作初步估價。",
    symptoms: [
      "沖涼期間企缸或浴缸水位逐漸上升",
      "關水後要很久才完全退水",
      "清走去水口表面頭髮後仍然去水慢",
      "浴室地台去水位出現異味、咕嚕聲或倒灌",
    ],
    causes: [
      "頭髮與番梘垢在隔渣位或隔氣內纏結",
      "較深入的支喉長期積聚毛髮及污垢",
      "去水喉斜度、接駁或老化問題令污物容易停留",
      "多個去水位同時受影響，可能涉及共用喉管",
    ],
    process: [
      {
        title: "了解積水情況",
        description:
          "先了解受影響位置、退水時間，以及洗手盆或地台去水有沒有同時變慢。",
      },
      {
        title: "檢查去水口及隔氣",
        description: "查看可見毛髮、隔渣配件及接駁情況，初步判斷堵塞深度。",
      },
      {
        title: "確認處理方法",
        description:
          "按喉管結構與堵塞位置建議機械疏通或其他合適方法，動工前確認收費。",
      },
      {
        title: "測試排水",
        description:
          "完成後以足夠水量測試企缸、浴缸及相關去水位，並整理施工位置。",
      },
    ],
    priceFactors: [
      "堵塞位於去水隔、隔氣或較深入支喉",
      "頭髮及污垢的積聚程度",
      "是否需要拆裝去水配件或隔氣",
      "浴室空間、喉管走向及施工難度",
    ],
    suitableFor: [
      "企缸塞及沖涼積水",
      "浴缸去水慢",
      "頭髮塞渠反覆出現",
      "浴室地台去水堵塞",
    ],
    faqs: [
      {
        question: "企缸隔頭髮後仍去水慢，是否代表喉管已塞？",
        answer:
          "有可能。隔走表面頭髮只能處理去水口附近的污物；若退水仍慢，毛髮及番梘垢可能已積聚在隔氣或更深入支喉。",
      },
      {
        question: "可以用化學通渠水處理浴室頭髮塞渠嗎？",
        answer:
          "不建議反覆或混合使用化學通渠劑。藥劑可能殘留在積水中，增加接觸及後續施工風險，亦未必能完整清除纏結的毛髮。",
      },
      {
        question: "企缸和地台去水同時變慢代表甚麼？",
        answer:
          "兩個位置同時受影響，可能表示堵塞位於匯合後的支喉。若座廁或其他去水位亦有異常，便要進一步檢查共用喉管。",
      },
    ],
    relatedSlugs: [
      "toilet-unblocking",
      "kitchen-sink-unblocking",
      "sewage-backflow",
    ],
  },
  {
    slug: "sewage-backflow",
    name: "污水渠倒灌處理",
    shortName: "污水倒灌",
    eyebrow: "SEWAGE BACKFLOW",
    title: "污水渠倒灌｜低層水渠、屎渠倒灌處理｜通渠熊",
    description:
      "污水渠倒灌、水渠倒灌或低層單位去水口湧出污水？了解即時安全措施、常見成因、檢查流程及影響報價的因素，及早判斷局部支喉或大廈主渠問題。",
    heroTitle: "污水渠倒灌要先停止用水，再判斷受影響範圍",
    heroDescription:
      "低層地台、座廁或鋅盤湧出污水，可能涉及單位支喉或大廈共用主渠。應先避免接觸污水及繼續用水，再記錄倒灌位置與受影響樓層。",
    answerSummary: {
      handles: "座廁、地台或其他去水位出現污水倒灌、外溢與異味。",
      suitableWhen: "低層位置或多個去水位同時受影響，需要先控制外溢風險。",
      limitation: "倒灌源頭及公共喉管責任範圍，需要結合現場和物業資料判斷。",
      confirmBeforeWork:
        "確認安全措施、堵塞範圍、施工入口、責任界線及最終收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A2_onju5z.png",
    imageAlt: "香港低層單位污水渠及水渠倒灌處理",
    whatsappMessage:
      "你好，我想查詢污水渠倒灌。請告訴我需要提供哪些倒灌位置、樓層及現場影片，以便先判斷情況和作初步估價。",
    symptoms: [
      "低層地台去水位、企缸或座廁湧出污水",
      "樓上用水時，本單位去水口出現倒灌",
      "多個去水位同時發出咕嚕聲或水位上升",
      "沙井高水位、滿瀉或有強烈污水異味",
    ],
    causes: [
      "單位支喉被紙巾、油脂或異物堵塞",
      "大廈共用主渠積聚污物或沉積物",
      "沙井或下游排水位置受阻",
      "喉管變形、破損或其他結構問題",
    ],
    process: [
      {
        title: "先控制現場風險",
        description:
          "建議暫停相關位置用水、避免接觸污水，並記錄首次倒灌的時間及位置。",
      },
      {
        title: "確認影響範圍",
        description:
          "了解涉及多少潔具、單位或樓層，並向管理處查詢共用喉管是否亦有異常。",
      },
      {
        title: "檢查入口及流向",
        description:
          "按現場可用的清潔口、沙井及喉管走向，判斷堵塞方向和合適處理方法。",
      },
      {
        title: "疏通及排水測試",
        description:
          "確認方案與收費後施工，完成後觀察水位、流向及相關去水位置。",
      },
    ],
    priceFactors: [
      "問題屬於單位支喉還是大廈共用主渠",
      "倒灌範圍、堵塞位置及嚴重程度",
      "清潔口或沙井的可達程度",
      "是否需要高壓清洗、影像檢測或額外清理",
    ],
    suitableFor: [
      "低層單位污水倒灌",
      "地台去水口湧出污水",
      "多個去水位同時異常",
      "沙井滿瀉及主渠倒灌",
    ],
    faqs: [
      {
        question: "污水渠倒灌時應該先做甚麼？",
        answer:
          "先停止使用受影響的座廁、鋅盤及去水位置，避免赤腳接觸污水，並通知同住者或管理處。可在安全距離拍攝倒灌位置及水位變化供判斷。",
      },
      {
        question: "如何分辨單位支喉還是大廈主渠倒灌？",
        answer:
          "若只有一個潔具受影響，可能屬局部支喉；若多個去水位、低層單位或沙井同時異常，則較可能涉及共用喉管，仍要按現場檢查確認。",
      },
      {
        question: "水位退回去後是否代表問題已解決？",
        answer:
          "不一定。水位暫時回落可能只是用水量減少，堵塞仍然存在；再次大量用水時可能重現倒灌，應安排檢查。",
      },
    ],
    relatedSlugs: [
      "main-drain-manhole",
      "toilet-unblocking",
      "cctv-drain-inspection",
    ],
  },
  {
    slug: "high-pressure-jetting",
    name: "高壓水槍洗渠",
    shortName: "高壓洗渠",
    eyebrow: "HIGH-PRESSURE JETTING",
    title: "高壓水槍洗渠｜主渠油垢及反覆淤塞處理｜通渠熊",
    description:
      "高壓水槍洗渠適合哪些油垢、主渠及反覆淤塞情況？了解施工方式、適用範圍、喉管限制、現場要求及影響報價的因素，避免在未評估管道狀況前盲目施工。",
    heroTitle: "反覆淤塞，不一定適合只做局部打通",
    heroDescription:
      "高壓水流可用於清理部分管壁油垢及沉積物，但施工前仍要評估喉管物料、走向、接駁及現場排水條件。",
    answerSummary: {
      handles: "主渠或較長管段內的油脂、泥沙與管壁沉積物。",
      suitableWhen: "一般機械疏通後仍反覆淤塞，或需要清洗較大範圍管壁。",
      limitation: "老化、破裂或走向未明的喉管，未必適合直接使用高壓水力。",
      confirmBeforeWork: "檢查喉管狀況、入口與排水出口、保護措施及最終收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A3_fyozug.png",
    imageAlt: "香港高壓水槍洗渠及主渠清洗服務",
    whatsappMessage:
      "你好，我想查詢高壓水槍洗渠。請問我需要提供哪些現場相片、喉管資料或過往淤塞情況，以便先作初步估價？",
    symptoms: [
      "同一段喉管在短時間內反覆淤塞",
      "食肆或廚房排水系統積聚大量油垢",
      "主渠去水能力明顯下降",
      "一般機械疏通後仍未恢復理想流量",
    ],
    causes: [
      "油脂及污垢長期黏附在管壁",
      "泥沙、淤泥或其他沉積物累積",
      "長距離橫喉內形成大範圍堵塞",
      "過往工程只局部打通而未清理沉積物",
    ],
    process: [
      {
        title: "評估喉管資料",
        description: "了解喉管用途、物料、管徑、檢查口位置及過往維修紀錄。",
      },
      {
        title: "確認施工條件",
        description: "檢查進出水、排污位置及附近環境，評估高壓清洗是否合適。",
      },
      {
        title: "分段清洗",
        description: "按現場條件控制水壓及噴頭推進，分段處理管壁沉積物。",
      },
      {
        title: "測試及交代",
        description:
          "檢查排水表現，向客戶說明施工結果及是否需要進一步影像檢測。",
      },
    ],
    priceFactors: [
      "喉管長度、管徑及走向",
      "油垢或沉積物的種類與厚度",
      "檢查口及設備可到達程度",
      "供水、排污及現場保護要求",
    ],
    suitableFor: [
      "食肆排水及油脂喉管",
      "大廈主渠去水能力下降",
      "長距離喉管積垢",
      "反覆淤塞的管道",
    ],
    faqs: [
      {
        question: "高壓水槍是否適合所有喉管？",
        answer:
          "不是。老化、破損、接駁不穩或部分特殊物料的喉管，需要先評估狀況。師傅會按現場條件建議合適方法。",
      },
      {
        question: "高壓洗渠與一般通渠有甚麼分別？",
        answer:
          "一般疏通主要恢復通道；高壓清洗則可針對部分管壁沉積物作較大範圍清理。實際選擇視乎堵塞成因。",
      },
      {
        question: "是否需要先做 CCTV 照喉？",
        answer:
          "並非每次都需要。如果喉管狀況不明、反覆淤塞或懷疑破損，影像檢測可協助判斷問題及施工風險。",
      },
    ],
    relatedSlugs: [
      "cctv-drain-inspection",
      "main-drain-manhole",
      "sewage-backflow",
    ],
  },
  {
    slug: "cctv-drain-inspection",
    name: "CCTV 照喉檢測",
    shortName: "CCTV 照喉",
    eyebrow: "CCTV DRAIN INSPECTION",
    title: "CCTV 照喉｜管道淤塞及破損影像檢測｜通渠熊",
    description:
      "CCTV 照喉可協助查看管內淤塞、異物、接駁及可見破損情況，適合反覆淤塞、問題位置不明或維修前評估的排水管道。了解檢測流程、限制及影響報價的因素。",
    heroTitle: "反覆淤塞或問題位置不明，先用影像了解管內情況",
    heroDescription:
      "CCTV 管道鏡頭可在合適的喉管及檢查口條件下，協助查看堵塞物、積垢、接駁或可見破損，減少單靠估計。",
    answerSummary: {
      handles: "檢查喉內積垢、可見破損、異物、接駁狀況及大概走向。",
      suitableWhen: "問題反覆出現、堵塞原因未明，或處理前後需要影像協助判斷。",
      limitation: "鏡頭受入口、管徑、彎位和堵塞程度限制，未必能到達所有位置。",
      confirmBeforeWork: "確認檢查範圍、可用入口、是否先疏通及影像交付安排。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A4_hiufrh.png",
    imageAlt: "香港 CCTV 照喉及排水管道影像檢測",
    whatsappMessage:
      "你好，我想查詢 CCTV 照喉檢測。喉管有反覆淤塞或問題位置不明，請先提供所需資料及初步估價。",
    symptoms: [
      "同一位置通渠後仍反覆出現問題",
      "懷疑有異物但無法確定位置",
      "需要了解喉管內可見的接駁或破損情況",
      "工程前希望先掌握管道走向及狀況",
    ],
    causes: [
      "管內存在未完全清除的異物或沉積物",
      "喉管接駁錯位、變形或局部破損",
      "喉管斜度或結構令污物容易積聚",
      "問題位置較深入，外觀檢查難以判斷",
    ],
    process: [
      {
        title: "確認檢查目的",
        description: "先了解是反覆淤塞、尋找異物、檢查破損，還是工程前評估。",
      },
      {
        title: "尋找合適入口",
        description: "檢查可用的清潔口、沙井或喉管入口，評估鏡頭能否安全進入。",
      },
      {
        title: "進行影像檢查",
        description: "按喉管條件推進鏡頭，記錄可見的堵塞物、接駁及異常位置。",
      },
      {
        title: "說明發現",
        description: "向客戶交代可見情況、檢測限制及下一步處理建議。",
      },
    ],
    priceFactors: [
      "檢查喉管的長度及管徑",
      "入口位置與可達程度",
      "管內積水、污物及彎位情況",
      "是否需要額外清理後才能進行檢測",
    ],
    suitableFor: [
      "反覆淤塞的喉管",
      "懷疑管道破損",
      "尋找可見異物位置",
      "通渠或維修前評估",
    ],
    faqs: [
      {
        question: "CCTV 照喉是否可以看到所有問題？",
        answer:
          "不能保證。視線會受積水、污物、急彎、管徑及鏡頭可達範圍限制；檢測結果應按現場條件解讀。",
      },
      {
        question: "喉管完全淤塞時可否直接照喉？",
        answer:
          "如果鏡頭無法通過堵塞位置，可能需要先作局部疏通或清理，才可檢查更深入範圍。",
      },
      {
        question: "照喉後是否一定需要更換喉管？",
        answer:
          "不一定。影像檢測是協助判斷的工具，下一步可包括清理、局部維修、持續觀察或其他處理。",
      },
    ],
    relatedSlugs: [
      "high-pressure-jetting",
      "main-drain-manhole",
      "sewage-backflow",
    ],
  },
  {
    slug: "main-drain-manhole",
    name: "大廈主渠及沙井通渠",
    shortName: "主渠／沙井",
    eyebrow: "MAIN DRAIN & MANHOLE",
    title: "主渠沙井通渠｜大廈倒灌、滿瀉處理｜通渠熊",
    description:
      "大廈主渠倒灌、沙井滿瀉或多個去水位同時淤塞？了解常見成因、現場檢查、處理流程、物業責任範圍及影響報價的因素，並可經 WhatsApp 先提供資料作初步估價。",
    heroTitle: "多個單位或去水位同時受影響，問題可能在主渠",
    heroDescription:
      "主渠及沙井問題涉及較大排水範圍，處理前應了解受影響位置、沙井水位、渠管走向及物業責任範圍。",
    answerSummary: {
      handles: "大廈主渠倒灌、沙井高水位或滿瀉，以及多個去水位同時淤塞。",
      suitableWhen: "問題涉及多個單位、樓層、去水位或物業共用排水系統。",
      limitation: "渠管走向、堵塞位置及物業責任，不能只憑單一去水位判斷。",
      confirmBeforeWork:
        "確認受影響範圍、沙井與施工入口、責任安排、方案及收費。",
    },
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A2_onju5z.png",
    imageAlt: "香港大廈主渠倒灌及沙井滿瀉通渠",
    whatsappMessage:
      "你好，我想查詢大廈主渠／沙井通渠。現場有倒灌、滿瀉或多個去水位受影響，請告訴我需要提供哪些資料作初步估價。",
    symptoms: [
      "低層單位或地面去水位出現倒灌",
      "多個廁所、鋅盤或地台去水同時變慢",
      "沙井水位過高、滿瀉或發出強烈異味",
      "雨季或用水高峰期間問題特別明顯",
    ],
    causes: [
      "主渠積聚油脂、泥沙或其他沉積物",
      "異物進入共用排水系統",
      "樹根、喉管變形或結構問題",
      "沙井或下游管道排水受阻",
    ],
    process: [
      {
        title: "確認受影響範圍",
        description: "了解涉及多少去水位、單位或樓層，以及問題首次出現的時間。",
      },
      {
        title: "檢查沙井及入口",
        description: "觀察水位、流向及可用施工入口，初步判斷堵塞方向及範圍。",
      },
      {
        title: "制定處理方案",
        description:
          "按管徑、距離及堵塞情況建議機械疏通、高壓清洗或進一步檢測。",
      },
      {
        title: "測試排水能力",
        description: "工程後觀察水位及流向，確認排水恢復情況並交代後續建議。",
      },
    ],
    priceFactors: [
      "主渠管徑、長度及堵塞位置",
      "沙井及施工入口的可達程度",
      "所需設備、人手及現場保護",
      "是否涉及影像檢測或大型清理工程",
    ],
    suitableFor: [
      "大廈主渠倒灌",
      "沙井滿瀉或高水位",
      "多個去水位同時淤塞",
      "物業及商業排水系統",
    ],
    faqs: [
      {
        question: "如何分辨單位內支喉與大廈主渠問題？",
        answer:
          "如果只有單一潔具受影響，較可能屬局部問題；若多個去水位、單位或低層位置同時倒灌，便可能涉及共用喉管。",
      },
      {
        question: "主渠工程由業主還是管理處負責？",
        answer:
          "要視乎堵塞位置、屋苑公契及物業責任範圍。施工前宜先向管理處確認共用喉管及進場安排。",
      },
      {
        question: "沙井滿瀉是否可以等待水位自行回落？",
        answer:
          "水位回落不代表堵塞已消失。若再次用水便重現滿瀉，應盡快檢查，並避免接觸污水或自行打開危險井蓋。",
      },
    ],
    relatedSlugs: [
      "sewage-backflow",
      "high-pressure-jetting",
      "cctv-drain-inspection",
    ],
  },
];

export const SERVICE_SLUGS = SERVICE_PAGES.map(service => service.slug);

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find(service => service.slug === slug);
}
