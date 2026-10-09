import type { BlogPost } from "./blogData";

/** Distinct customer questions; publication dates never stand in for project dates. */
export const SEO_ARTICLES: BlogPost[] = [
  {
    slug: "choosing-professional-drain-company",
    title: "專業通渠公司點樣揀？由檢查、施工到完工交代",
    category: "實用指南",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "搵專業通渠服務，先睇對方能否解釋問題、施工方法和驗收方式。這份比較清單幫住宅、食肆及物業客戶問清楚需要的安排。",
    keywords: ["專業通渠", "通渠公司", "香港通渠", "通渠服務比較"],
    serviceSlugs: [
      "toilet-unblocking",
      "kitchen-sink-unblocking",
      "cctv-drain-inspection",
    ],
    relatedSlugs: [
      "drain-service-completion-checklist",
      "drain-tool-selection-guide",
      "24-hour-drain-help-night",
    ],
    sections: [
      {
        type: "p",
        text: "專業通渠要看的，是對方能否把現場問題、採用的方法和完成後的檢查說清楚。單看機器相片或『即刻搞掂』的宣傳，未必知道服務是否合適。先提供地區、受影響位置及相片，再比較對方如何回應，比只問一句『通渠幾錢』更有用。",
      },
      { type: "h2", text: "先分清：你需要疏通、清洗，還是檢查？" },
      {
        type: "p",
        text: "單一去水位塞住，與多個單位同時倒灌，需要了解的範圍不同。機械疏通常用於處理較集中的堵塞；高壓洗渠針對較長管段的沉積；CCTV 照喉用來觀察可見管內情況。未看現場就指定同一方法，不足以說明是否合適。",
      },
      { type: "h2", text: "比較服務時，可以問這四件事" },
      {
        type: "list",
        ordered: true,
        items: [
          "你根據哪個現象判斷問題方向？還有甚麼未確認？",
          "預計由哪個喉口處理？要不要拆喉或移動設備？",
          "完成後會如何測試去水，有沒有需要我配合的用水位置？",
          "如果發現另一段管道有問題，會先如何跟我交代？",
        ],
      },
      { type: "h2", text: "24 小時接受查詢，與已確認上門是兩回事" },
      {
        type: "p",
        text: "夜晚搜尋 24小時通渠，應先說明有沒有污水湧出、是否影響多個位置，以及現場可否進入。通渠熊接受 24 小時查詢，上門時間會按地區、人手及設備確認。需要的是一個已確認的安排，不能只憑網站有『24 小時』字樣，就當成已經有師傅出發。",
      },
      { type: "h2", text: "真實紀錄要看清它能證明甚麼" },
      {
        type: "p",
        text: "影片可以展示工具和施工空間，卻未必包含完工試水。看案例時，留意它寫的是實際處理、測試結果，還是只記錄操作。以通渠熊的坐廁工具短片為例，它展示疏通動作，並沒有完整沖水測試；因此不能由這段片推定所有工程的效果。",
      },
      {
        type: "tip",
        text: "搵人通渠時，將『發現甚麼、打算怎樣處理、完成後怎樣核對』連起來問。清楚的解釋比一串專業名詞更容易比較。",
      },
    ],
    resourceLinks: [
      { label: "通渠服務及適用問題", href: "/services" },
      { label: "上門與處理安排", href: "/service-process" },
      {
        label: "坐廁現場工具操作紀錄",
        href: "/cases/toilet-drain-tool-operation",
        note: "此短片未包含完整沖水測試。",
      },
    ],
    faqs: [
      {
        question: "專業通渠一定要用高壓水槍嗎？",
        answer:
          "不一定。處理方法要按堵塞物、管道狀況、入口及施工目的選擇；局部堵塞未必需要高壓清洗。應先了解為何選用該工具。",
      },
      {
        question: "比較專業通渠服務，最值得問哪一項？",
        answer:
          "問清楚『完成後如何核對去水』，並同時確認處理位置及仍未確定的問題。這能把施工工序與實際觀察結果連起來。",
      },
      {
        question: "網站寫 24小時通渠，是否代表已預約成功？",
        answer:
          "不是。通渠熊的 24 小時指接受查詢，實際上門時間須按地區、人手及設備另行確認；應在對話中取得安排確認。",
      },
    ],
  },
  {
    slug: "24-hour-drain-help-night",
    title: "24小時通渠：夜晚塞渠先做甚麼？安全處理與上門準備",
    category: "緊急應對",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "夜晚塞渠先停止令水位上升的用水，再交代地區、倒灌範圍及現場入口。了解 24小時通渠查詢與上門安排，避免等待期間令情況惡化。",
    keywords: ["24小時通渠", "夜晚通渠", "緊急通渠", "通渠"],
    serviceSlugs: [
      "toilet-unblocking",
      "sewage-backflow",
      "bathroom-drain-unblocking",
    ],
    relatedSlugs: [
      "24-hour-shared-drain-backflow-coordination",
      "toilet-clog-emergency-guide",
      "whatsapp-drain-quote-checklist",
    ],
    sections: [
      {
        type: "p",
        text: "夜晚塞渠，第一步是停止令水位繼續上升的用水，然後確認受影響範圍。若坐廁水位已高，不要再沖；有污水湧出，也不要為了拍片反覆開水測試。24小時通渠的查詢可以協助了解處理方向，但現場安全和上門安排仍要逐項確認。",
      },
      { type: "h2", text: "先睇三個訊號，決定怎樣交代情況" },
      {
        type: "list",
        items: [
          "只有一個位置去水慢：說明是坐廁、鋅盤或地台去水，其他位置有沒有異常。",
          "水位持續上升或污水倒灌：停止相關用水，避免直接接觸，交代水有沒有流出地面。",
          "多個位置或多個單位同時出問題：通知管理處或現場負責人，避免只處理單一去水位。",
        ],
      },
      { type: "h2", text: "聯絡時不用寫長篇，先提供這些資料" },
      {
        type: "p",
        text: "提供地區、場所類型、塞渠位置、開始時間及相片便可開始了解。說明是否已用通渠水、是否出現倒灌，並交代管理處夜間登記、停車、升降機或門禁限制。拍攝時站在安全乾燥的位置，不用接近污水或開蓋檢查沙井。",
      },
      { type: "h2", text: "等候期間，哪些動作應停止？" },
      {
        type: "p",
        text: "不要混合通渠水、漂白水或其他清潔劑，也不要拆開裝有未知液體的喉件。不要自行進入沙井或密閉渠務空間。有電器、插座或電線受水浸影響，先遠離危險位置；有人受傷或有即時人身危險時，應優先尋求緊急救援。",
      },
      { type: "h2", text: "確認上門時，要講清楚誰可以開門及配合" },
      {
        type: "p",
        text: "住戶應確認能開門及交代問題的聯絡人；食肆應確認可進入的廚房區域；物業則要有人協調公用入口。專業通渠可能需要看另一個去水位或較下游的喉口，若只取得單一單位的出入權限，處理範圍可能受限制。",
      },
      {
        type: "tip",
        text: "可用一句訊息開始：『我在觀塘住宅，坐廁水位升高，已停用，其他去水位暫時正常，附相片。請確認可安排時間。』這是資料示例，不是已確認的工程紀錄。",
      },
    ],
    resourceLinks: [
      { label: "坐廁通渠服務", href: "/services/toilet-unblocking" },
      { label: "污水倒灌處理", href: "/services/sewage-backflow" },
      { label: "按地區查詢", href: "/areas" },
      { label: "上門流程", href: "/service-process" },
    ],
    faqs: [
      {
        question: "夜晚等通渠師傅時，可以再沖一次試吓嗎？",
        answer:
          "坐廁水位已高或有倒灌時，不應再次沖水測試。停止相關用水，保留安全拍攝的相片，先交代問題範圍。",
      },
      {
        question: "夜間 24小時通渠查詢要提供完整地址嗎？",
        answer:
          "初步查詢可先提供地區、場所和受影響位置；完整地址及進場方法在確認上門安排時提供，不用在網站公開。",
      },
      {
        question: "夜晚只有鋅盤去水慢，也可以查詢通渠嗎？",
        answer:
          "可以。說明是否仍能慢慢排走、水位有沒有上升及其他位置是否正常，團隊再按現場資料確認處理方向及可安排時間。",
      },
    ],
  },
  {
    slug: "drain-service-completion-checklist",
    title: "專業通渠後點驗收？坐廁、鋅盤與公共渠的去水測試",
    category: "實用指南",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "通渠完成後不只看工具收起。按處理位置核對去水、接駁及仍未檢查的管段，保留可重看的施工交代，方便日後跟進。",
    keywords: ["專業通渠", "通渠驗收", "通渠後去水測試", "通渠"],
    serviceSlugs: [
      "toilet-unblocking",
      "kitchen-sink-unblocking",
      "main-drain-manhole",
      "high-pressure-jetting",
    ],
    relatedSlugs: [
      "choosing-professional-drain-company",
      "drain-blocked-again-after-cleaning-root-causes",
      "read-cctv-drain-inspection-report",
    ],
    sections: [
      {
        type: "p",
        text: "通渠後的驗收，要對照這次確認的處理位置和工序。去水恢復，是重要的觀察；但一次試水不等於整棟大廈所有管段都已檢查，也不能保證日後不再堵塞。專業通渠的完工交代，應讓客戶分得清『今次做到甚麼』和『哪些情況仍需留意』。",
      },
      { type: "h2", text: "坐廁、鋅盤與公共渠，要分開測試" },
      {
        type: "list",
        items: [
          "坐廁：由師傅按現場情況配合沖水，觀察水位回落及有沒有回湧。不要在原本仍滿水的坐廁自行反覆測試。",
          "鋅盤：配合放水觀察排走情況；若拆過喉，亦核對重新接駁位置有沒有可見漏水。",
          "公共渠：交代試水由哪個入口開始、哪些用水位置配合，以及已觀察到的下游範圍。住戶不要自行開蓋或進入沙井。",
        ],
      },
      { type: "h2", text: "四項完成交代，值得記錄下來" },
      {
        type: "list",
        ordered: true,
        items: [
          "實際處理的是哪個去水位或管段，而不是只記機器名稱。",
          "用了哪些已確認工序，有沒有發現另外的異常。",
          "試水方法及觀察結果，有沒有仍未能檢查的範圍。",
          "有沒有需要後續觀察、照喉或維修的原因。",
        ],
      },
      { type: "h2", text: "有影片，就一定證明完成測試嗎？" },
      {
        type: "p",
        text: "不一定。短片可能只記錄工具進入喉口，沒有拍到接喉和放水。通渠熊已公開的櫃內工具短片，便只展示近鏡操作，未包含完整試水。用這類素材了解施工空間可以，但不要把它當成該工程已通過全部驗收的證據。",
      },
      { type: "h2", text: "完成後再出現去水慢，怎樣跟進較有用？" },
      {
        type: "p",
        text: "記低再次出現的時間、受影響位置，以及是否在其他位置用水時發生。保留當次施工交代和安全拍攝的短片，讓團隊比較問題是否相同。曾使用通渠水也要說明；不要為取得證據而不斷增加用水，令倒灌擴大。",
      },
      {
        type: "tip",
        text: "驗收清單是溝通工具，並非遠端判定合格的證書。管道內部狀況、接駁完整性和隱蔽管段，仍要按實際檢查範圍交代。",
      },
    ],
    resourceLinks: [
      { label: "施工及完工流程", href: "/service-process" },
      {
        label: "櫃內喉口操作紀錄",
        href: "/cases/cabinet-drain-access-operation",
        note: "這段素材未包括接喉後完整試水。",
      },
      { label: "CCTV 照喉適用情況", href: "/services/cctv-drain-inspection" },
    ],
    faqs: [
      {
        question: "通渠後放一次水正常，是否代表所有管道都正常？",
        answer:
          "不是。試水只反映當次測試條件及觀察範圍；未檢查的管段、間歇性問題或其他單位的支渠，不能由一次試水推定正常。",
      },
      {
        question: "鋅盤通渠拆過喉，完工要核對甚麼？",
        answer:
          "按施工範圍配合放水，核對去水情況及重新接駁位置有沒有可見漏水，並請師傅交代已檢查和未檢查的部分。",
      },
      {
        question: "公共渠通渠驗收需要住戶自己開沙井嗎？",
        answer:
          "不需要，亦不應自行進入沙井。由現場負責人與師傅協調入口、配合試水位置及安全安排，再交代觀察結果。",
      },
    ],
  },
  {
    slug: "sink-drain-access-disassembly",
    title: "鋅盤通渠一定要拆喉？櫃底入口、隔氣與施工空間",
    category: "家居防塞",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "鋅盤通渠是否拆喉，要看堵塞位置、入口及接駁狀況。先拍櫃底全景、清空施工空間，了解狹窄位置會如何影響處理安排。",
    keywords: ["鋅盤通渠", "專業通渠", "通渠拆喉", "櫃底去水"],
    serviceSlugs: ["kitchen-sink-unblocking", "cctv-drain-inspection"],
    relatedSlugs: [
      "drain-service-completion-checklist",
      "prevent-kitchen-sink-clog",
      "whatsapp-drain-quote-checklist",
    ],
    sections: [
      {
        type: "p",
        text: "鋅盤通渠不一定要拆喉。是否需要由櫃底喉口處理，要看堵塞可能在哪裡、原入口能否使用，以及喉件接駁和施工空間。相片可以幫助初步了解，但不能隔着櫃門確認管道內部狀況；安排專業通渠時，最好同時提供鋅盤和櫃底全景。",
      },
      { type: "h2", text: "為甚麼師傅會查看櫃底？" },
      {
        type: "p",
        text: "櫃底通常可見鋅盤下方喉件、隔氣及部分去水接駁。這些位置有助辨認入口、判斷能否放入工具，亦可看到是否有可見滲漏。若問題在較下游或共用管道，單靠處理隔氣未必足夠；其他去水位同時異常時，也要一併說明。",
      },
      { type: "h2", text: "上門前，先拍三個角度" },
      {
        type: "list",
        items: [
          "鋅盤全景：看清單槽或雙槽、去水口和附近設備。",
          "櫃底全景：包括喉件、可見接駁及櫃門開啟空間，不只拍一小段喉。",
          "異常位置：安全情況下拍積水或可見滴水；已倒灌或用過通渠水，就不要再開水測試。",
        ],
      },
      { type: "h2", text: "清出空間，但不要自行鬆開喉件" },
      {
        type: "p",
        text: "可先移走櫃內乾淨的可搬物品，讓工具和接水容器有位置。若櫃底已有未知積水或化學劑，先告知，不要伸手清理。老化、黏接或難以重新接回的喉件，處理方法需要現場評估；用力擰開可能令漏水問題更難處理。",
      },
      { type: "h2", text: "真實短片能幫你看清狹窄位置的操作" },
      {
        type: "p",
        text: "通渠熊的櫃底線材紀錄，可見師傅在去水位置操作工具，下方放有接水容器。它說明施工空間和承接水的安排，沒有確認每宗鋅盤工程都要拆同一段喉，也沒有展示完整放水測試。實際入口及方法仍按你的現場決定。",
      },
      {
        type: "tip",
        text: "若鋅盤、洗碗機或其他設備共用去水接駁，請在查詢時列出設備。不要只說『廚房塞咗』，否則容易漏掉受影響範圍。",
      },
    ],
    resourceLinks: [
      { label: "廚房鋅盤通渠", href: "/services/kitchen-sink-unblocking" },
      {
        label: "櫃底去水位操作短片",
        href: "/cases/under-sink-drain-line-operation",
        note: "片段記錄工具操作，未顯示完整放水測試。",
      },
      { label: "現場查詢準備", href: "/guide" },
    ],
    faqs: [
      {
        question: "鋅盤通渠前要自己拆開隔氣嗎？",
        answer:
          "不必先自行拆喉。先提供櫃底全景及問題位置，交代是否用過通渠水；由師傅按接駁狀況、堵塞方向和入口評估處理方法。",
      },
      {
        question: "櫃底太窄會影響鋅盤通渠安排嗎？",
        answer:
          "會影響可使用的入口、工具及接水安排。先說明櫃門能否完全打開、有沒有固定設備或不能移動的物品，方便評估進場條件。",
      },
      {
        question: "鋅盤與洗碗機一起去水慢，查詢時要講嗎？",
        answer:
          "要。多個設備同時異常可能涉及共用接駁或較下游管段，應列出受影響設備及出現時間，不能只按單一鋅盤判斷。",
      },
    ],
  },
  {
    slug: "toilet-foreign-object-drain-service",
    title: "坐廁通渠遇到異物點算？硬物、拆坐廁與處理限制",
    category: "緊急應對",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "玩具、瓶蓋或其他硬物掉入坐廁，先停止沖水，記錄物件形狀及去向。了解異物與一般淤塞的分別，避免把物件推進更深的管段。",
    keywords: ["坐廁通渠", "專業通渠", "坐廁異物", "24小時通渠"],
    serviceSlugs: ["toilet-unblocking", "cctv-drain-inspection"],
    relatedSlugs: [
      "toilet-clog-emergency-guide",
      "24-hour-drain-help-night",
      "drain-service-completion-checklist",
    ],
    sections: [
      {
        type: "p",
        text: "硬物掉入坐廁後，先停止沖水，不要靠反覆沖水把它『沖走』。玩具、瓶蓋或小容器，與紙張造成的局部淤塞不同：它可能卡在彎位，也可能已往下游移動。安排坐廁通渠時，物件的形狀、大小和最後看見的位置，比單說『塞廁所』更有助判斷。",
      },
      { type: "h2", text: "記低甚麼物件，不要再加力推進" },
      {
        type: "p",
        text: "若知道是哪一件物品，可拍相同物件或提供大概尺寸，交代掉入後沖過幾次水，以及水位如何變化。不知道是否有異物，也應說明近期有沒有物件不見。不要用硬杆、鋼線或自行改裝工具盲目推入，以免令物件更難取出或損傷喉件。",
      },
      { type: "h2", text: "不同位置，處理入口可能不同" },
      {
        type: "list",
        items: [
          "仍在可見位置：先交代是否看得到，不要接觸含有污水或化學劑的液體。",
          "疑似卡在坐廁內部彎位：需要評估能否由現有入口處理，未必適合一味推進。",
          "懷疑已進入下游：要配合其他去水位情況及可用喉口，必要時評估檢查範圍。",
        ],
      },
      { type: "h2", text: "有異物，就一定要拆坐廁嗎？" },
      {
        type: "p",
        text: "不一定，也不能在未檢查前保證不用拆。是否拆卸，要看物件位置、坐廁結構、可用入口和重新接駁條件。專業通渠應先說明處理方向與限制；需要改動施工範圍時，先確認再進行。",
      },
      { type: "h2", text: "取出物件與恢復去水，是不同的觀察" },
      {
        type: "p",
        text: "水位回落不等於已取出硬物。完成後可詢問是否有找到物件、哪些位置已處理，以及試水觀察到甚麼。若未能確認物件去向，就要如實記錄；不要把一次去水正常當成物件已消失的證據。",
      },
      {
        type: "tip",
        text: "夜晚發生也可作 24小時通渠查詢。先交代異物和已停用的情況，再確認上門時間；不要因等候而不停試沖。",
      },
    ],
    resourceLinks: [
      { label: "坐廁通渠處理範圍", href: "/services/toilet-unblocking" },
      { label: "管道檢查及限制", href: "/services/cctv-drain-inspection" },
      {
        label: "坐廁工具操作紀錄",
        href: "/cases/toilet-drain-tool-operation",
        note: "片段不證明有硬物或已成功取出物件。",
      },
    ],
    faqs: [
      {
        question: "坐廁有硬物，通渠水能把它溶掉嗎？",
        answer:
          "不應用通渠水處理未知硬物。不同物料不會因此安全消失，化學劑留在管內也會增加後續操作風險。先停用並交代物件資料。",
      },
      {
        question: "坐廁異物堵塞一定要拆坐廁嗎？",
        answer:
          "不一定。是否拆卸要按物件位置、坐廁結構及可用入口現場評估，不能只憑相片保證需要或不需要拆。",
      },
      {
        question: "坐廁通渠後水位正常，是否證明異物已取出？",
        answer:
          "不是。應分開確認有沒有實際取出物件、已處理的位置及試水結果；一次排水正常不能確認硬物去向。",
      },
    ],
  },
  {
    slug: "24-hour-restaurant-drain-emergency",
    title: "24小時通渠支援食肆：營業中塞渠的分流與協調",
    category: "商業渠務",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "食肆營業中塞渠，先分開受影響的洗滌、備餐和公共去水區。整理設備、隔油設施與可施工時段，讓通渠安排與現場運作更容易協調。",
    keywords: ["24小時通渠", "食肆通渠", "專業通渠", "餐廳塞渠"],
    serviceSlugs: [
      "grease-trap-cleaning",
      "high-pressure-jetting",
      "sewage-backflow",
    ],
    relatedSlugs: [
      "restaurant-grease-trap-guide",
      "drain-service-completion-checklist",
      "24-hour-shared-drain-backflow-coordination",
    ],
    sections: [
      {
        type: "p",
        text: "食肆營業中塞渠，先停止向受影響管道排水，並由負責人分開受污水影響的區域、工具與乾淨備餐區。24小時通渠查詢時，重點不是只講『廚房塞』，而是說明哪些鋅盤、設備或地台去水同時異常，方便評估施工與營業安排。",
      },
      { type: "h2", text: "先列受影響設備，別只拍一個水面" },
      {
        type: "list",
        items: [
          "哪些鋅盤、洗碗設備或地台去水出現積水，是否同時發生。",
          "隔油池位置及可見外觀，有沒有已知的最近清理紀錄。",
          "其他商戶、後巷或公用去水位置是否有相同問題。",
          "是否已使用通渠水或其他清潔劑，誰可確認現場情況。",
        ],
      },
      { type: "h2", text: "營業中可否施工，要看現場分隔條件" },
      {
        type: "p",
        text: "部分位置可以在取得安全空間後安排處理，亦有情況需要停用相連設備或等候合適時段。先交代工具搬運路線、熱源、電器、備餐區及客人出入範圍，不應為了維持運作而讓污水影響區域繼續與乾淨工作區混用。這份文章是渠務協調指南，不代替食物安全的現場管理要求。",
      },
      { type: "h2", text: "隔油池清理，與下游管道疏通可能要分開安排" },
      {
        type: "p",
        text: "隔油設施有油垢，不代表所有堵塞都在池內；清理設施，也不等於較下游管道已暢通。專業通渠需要了解入口、管段及排水去向，才評估是否涉及機械疏通、高壓清洗或其他檢查。不要只按『有油』便指定單一工序。",
      },
      { type: "h2", text: "完成後，哪些設備可以恢復使用？" },
      {
        type: "p",
        text: "由現場負責人配合已確認的位置試水，問清楚處理範圍及仍受限制的設備。去水觀察與受影響區域的清理、食物和用具處理是不同工作；不能只因管道排水恢復，就推定整個廚房可照常運作。",
      },
      {
        type: "tip",
        text: "預先整理『負責人、設備、入口、施工時段』四項資料，較容易協調夜間或繁忙時段的上門。通渠熊接受 24 小時查詢，實際時間另行確認。",
      },
    ],
    resourceLinks: [
      { label: "食肆及商舖渠務安排", href: "/customers/restaurants" },
      { label: "隔油池清理", href: "/services/grease-trap-cleaning" },
      { label: "高壓洗渠適用範圍", href: "/services/high-pressure-jetting" },
    ],
    faqs: [
      {
        question: "食肆營業中塞渠，可以一邊排水一邊通渠嗎？",
        answer:
          "不能一概而論。先停止向受影響管道排水，交代相連設備、污水範圍及可分隔空間；由現場負責人與師傅確認可施工條件。",
      },
      {
        question: "清理隔油池後，餐廳所有去水一定恢復嗎？",
        answer:
          "不一定。堵塞亦可能在較下游或其他接駁管段，隔油池清理與管道疏通的範圍要分開確認並配合試水。",
      },
      {
        question: "食肆作 24小時通渠查詢，要說明哪些進場限制？",
        answer:
          "提供廚房入口、設備和熱源位置、工具搬運路線、可停用設備及現場負責人，並說明可施工時段；上門時間須另行確認。",
      },
    ],
  },
  {
    slug: "property-drain-maintenance-plan",
    title: "專業通渠保養計劃：物業主渠巡查、紀錄與交接",
    category: "大廈渠務",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "物業通渠保養不只是定期叫人洗渠。先整理位置、投訴及既有工程紀錄，再按管道使用和異常情況安排巡查、清理或檢查。",
    keywords: ["專業通渠", "物業通渠保養", "主渠保養", "通渠"],
    serviceSlugs: [
      "main-drain-manhole",
      "high-pressure-jetting",
      "cctv-drain-inspection",
    ],
    relatedSlugs: [
      "building-main-drain-vs-unit-branch-pipe",
      "read-cctv-drain-inspection-report",
      "24-hour-shared-drain-backflow-coordination",
    ],
    sections: [
      {
        type: "p",
        text: "物業的專業通渠保養，應從位置及既有紀錄開始，而不是為全幢大廈設定同一個清洗頻率。住宅、食肆排水和戶外雨水系統的使用情況不同；反覆投訴的時段、受影響樓層及過往工序，能幫助團隊決定先巡查、清理還是檢查。",
      },
      { type: "h2", text: "先把排水位置與聯絡安排整理好" },
      {
        type: "list",
        items: [
          "已知主渠、沙井及清潔口的位置，以及需要誰協調進場。",
          "受影響單位或商戶、出現時間和用水情況，不在公開紀錄填住戶個人資料。",
          "過往施工位置、採用工序及已記錄的測試結果。",
          "可安排時段、工具搬運路線和不能停用的設備。",
        ],
      },
      { type: "h2", text: "巡查、清洗與照喉，目的不同" },
      {
        type: "p",
        text: "巡查可整理可見異常及投訴模式，清洗針對已確認管段的沉積，照喉則保存可見管內情況。不是每次保養都需要三項一起做；也不能只完成一次清洗，便把原因不明的反覆堵塞當作已解決。先說明這次要回答哪個問題，再選工序。",
      },
      { type: "h2", text: "每次處理後，留下可交接的紀錄" },
      {
        type: "p",
        text: "記錄工程日期、處理入口、管段、方法及去水觀察。若使用影像檢查，保存入口方向、距離基準和影像限制。不同更次或外判團隊接手時，能對照『上次看過哪裡』，避免只剩下一張沒有位置的相片。",
      },
      { type: "h2", text: "保養頻率，應怎樣調整？" },
      {
        type: "p",
        text: "把近期異常、積垢、商戶使用及季節影響一起看。清理後仍短期復發，可重新評估檢查範圍，而不是直接把洗渠次數加倍。這裡不提供統一週期，因為沒有現場資料，不能把另一個屋苑的安排當作你的物業所需。",
      },
      {
        type: "tip",
        text: "另設一份應急聯絡表：管理處、可進場負責人、相關服務及受影響位置。需要 24小時通渠查詢時，先交代已有保養紀錄，較容易延續之前的判斷。",
      },
    ],
    resourceLinks: [
      { label: "業主及物業管理渠務", href: "/customers/property-management" },
      { label: "主渠及沙井服務", href: "/services/main-drain-manhole" },
      { label: "CCTV 照喉服務", href: "/services/cctv-drain-inspection" },
      {
        label: "戶外渠口操作紀錄",
        href: "/cases/outdoor-drain-chamber-operation",
        note: "影片未提供完整完工檢查或工程地區證據。",
      },
    ],
    faqs: [
      {
        question: "物業通渠保養是否每月洗一次主渠就足夠？",
        answer:
          "不能用統一頻率判斷。需要配合使用情況、異常紀錄及已檢查管段評估；原因不明或短期復發時，亦可能需要進一步檢查。",
      },
      {
        question: "物業通渠保養紀錄要保留哪些位置資料？",
        answer:
          "保留處理入口、方向、管段及配合試水的位置，再附工程日期、工序和觀察結果。相片或影像應能對回實際位置。",
      },
      {
        question: "保養後仍有住戶反映去水慢，應直接再洗同一條渠嗎？",
        answer:
          "先比較受影響位置、出現時間及之前已處理的範圍。未確認問題相同前，不應只憑一次投訴便指定重做相同工序。",
      },
    ],
  },
  {
    slug: "village-house-drain-access-planning",
    title: "村屋通渠點安排？狹窄通道、工具進場與沙井安全",
    category: "村屋渠務",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "村屋通渠先確認去水位置、沙井入口與工具搬運路線。狹窄通道、樓梯及共用位置會影響安排；住戶不用自行入井檢查。",
    keywords: ["村屋通渠", "專業通渠", "沙井通渠", "24小時通渠"],
    serviceSlugs: [
      "main-drain-manhole",
      "high-pressure-jetting",
      "sewage-backflow",
    ],
    relatedSlugs: [
      "village-house-manhole-rainy-season",
      "24-hour-drain-help-night",
      "property-drain-maintenance-plan",
    ],
    sections: [
      {
        type: "p",
        text: "村屋通渠除了了解堵塞位置，還要看工具怎樣到達現場。窄路、梯級、共用通道或距離較遠的渠口，都可能影響設備和人手安排。初步查詢先提供地區、受影響去水位及入口相片，不需要自行開沙井或走入渠務空間尋找原因。",
      },
      { type: "h2", text: "從落車位置開始，交代工具搬運路線" },
      {
        type: "list",
        items: [
          "可停靠或卸工具的位置，與施工入口之間是否有窄路或梯級。",
          "閘門、圍欄、固定雜物或其他會影響進出的地方。",
          "需要經過鄰居、業主或共用位置時，誰可協調出入。",
          "夜間照明及現場可聯絡的人，不由住戶自行接近危險渠口拍攝。",
        ],
      },
      { type: "h2", text: "單位去水與戶外渠口，未必屬同一處問題" },
      {
        type: "p",
        text: "先說明坐廁、鋅盤及浴室是否同時異常，鄰近住戶有沒有相同反映，以及問題是否只在下雨時出現。這些資料有助評估範圍，但不能由『村屋』或『沙井有水』直接判定堵塞位置、管道走向或維修責任。",
      },
      { type: "h2", text: "沙井安全：住戶不用入井確認" },
      {
        type: "p",
        text: "沙井和密閉渠務空間可能涉及缺氧、氣體及墜下等危險，不能靠看起來乾爽或沒有異味判定安全。不要自行進入、伸身探看或安排不具備安全條件的人入內。需要檢查的入口及方法，由具備合適能力和安全安排的人員評估。",
      },
      { type: "h2", text: "偏遠位置查詢，先確認現場條件再安排" },
      {
        type: "p",
        text: "搜尋 24小時通渠時，請說明地點和進場限制，不要只傳一個模糊定位點。通渠熊接受 24 小時查詢，實際服務時間和設備按地區與現場確認；未取得安排前，不應當作已可即時到達。",
      },
      {
        type: "tip",
        text: "戶外渠口的真實施工片可讓你了解開蓋後的操作位置，但它不證明另一條村的管道走向或故障原因。先對照自己的現場資料。",
      },
    ],
    resourceLinks: [
      { label: "主渠及沙井處理", href: "/services/main-drain-manhole" },
      { label: "服務地區查詢", href: "/areas" },
      {
        label: "戶外渠口施工短片",
        href: "/cases/outdoor-drain-chamber-operation",
        note: "未確認完整完工測試及施工地區。",
      },
    ],
    faqs: [
      {
        question: "村屋通渠查詢，除了地址還要提供甚麼？",
        answer:
          "提供受影響位置、其他去水位是否異常，以及落車點到施工入口的窄路、梯級、門禁和共用位置安排，方便評估工具進場。",
      },
      {
        question: "村屋沙井沒有臭味，可以自行落去檢查嗎？",
        answer:
          "不可以靠氣味判斷安全。沙井及密閉空間可能有缺氧、氣體及墜下風險，住戶不應自行進入，應由合適人員評估安全安排。",
      },
      {
        question: "村屋下雨時去水慢，能直接判定要高壓通渠嗎？",
        answer:
          "不能。先整理受影響位置、時間及鄰近去水情況，並確認管道及入口範圍；是否高壓清洗要按實際問題和條件評估。",
      },
    ],
  },
  {
    slug: "moving-home-drain-inspection",
    title: "搬屋前通渠檢查：睇樓、交樓要留意哪些去水訊號？",
    category: "家居防塞",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "搬屋前獲准測試去水，可留意鋅盤、洗手盆、坐廁及地台去水的可見異常。分清基本觀察與專業通渠檢查，避免把一次試水當成全部管道正常。",
    keywords: ["搬屋通渠檢查", "通渠", "專業通渠", "交樓去水檢查"],
    serviceSlugs: [
      "kitchen-sink-unblocking",
      "bathroom-drain-unblocking",
      "toilet-unblocking",
      "cctv-drain-inspection",
    ],
    relatedSlugs: [
      "sink-drain-access-disassembly",
      "drain-service-completion-checklist",
      "drain-gurgling-sound-causes",
    ],
    sections: [
      {
        type: "p",
        text: "睇樓或交樓時，如獲業主或現場負責人同意，可觀察各去水位的基本表現。這不等於完整驗樓，也不能證明隱蔽管道沒有問題。搬入前先記錄去水慢、回湧、可見滴水或持續渠味，再評估是否需要專業通渠或其他檢查，比入住後才追認問題清楚。",
      },
      { type: "h2", text: "先取得同意，逐個位置觀察" },
      {
        type: "list",
        items: [
          "鋅盤及洗手盆：留意放水後排走情況，以及可見喉件有沒有滴水。",
          "坐廁：由現場負責人確認可正常使用，再觀察沖水後水位是否回落。",
          "浴室地台去水：看有沒有原本積水、明顯回湧或周邊滲水，不拆開固定設備。",
          "設備接駁：如有洗衣機或洗碗機，交代是否已接上，不把未接駁狀態當作已測試正常。",
        ],
      },
      { type: "h2", text: "發現異常時，停止加水並記錄" },
      {
        type: "p",
        text: "水位已升高或有倒灌，就不要繼續測試。拍下安全可見的位置，記錄時間、當時用了哪個設備及有沒有其他位置同步異常。長期未使用的單位出現氣味，也不能只由氣味判斷是淤塞，需要把隔氣、使用情況與其他現象一起了解。",
      },
      { type: "h2", text: "基本試水與管內檢查，回答不同問題" },
      {
        type: "p",
        text: "基本試水可以觀察當時的排水，卻看不到整段管壁、彎位或接駁內部。反覆堵塞、原因不明或需要保存影像時，可評估 CCTV 照喉；照喉亦會受入口、積水和視線限制。不是每個搬屋前檢查都必須照喉，更不能以一次檢查保證所有隱蔽部分正常。",
      },
      { type: "h2", text: "需要安排處理，先確認授權及範圍" },
      {
        type: "p",
        text: "租客、準買家或新住戶，不應未經同意拆喉或改動固定設施。先由相關負責人確認可施工位置、進場及交代方式，再安排通渠。若涉及業主與租客責任，應對照合約和實際情況，這份檢查清單不作法律責任判定。",
      },
      {
        type: "tip",
        text: "保留原始觀察和後續處理紀錄，分開寫『我見到甚麼』與『師傅確認了甚麼』。相片註明位置和拍攝日期，日後比較會更清楚。",
      },
    ],
    resourceLinks: [
      { label: "住宅通渠服務", href: "/customers/residential" },
      { label: "浴室及企缸通渠", href: "/services/bathroom-drain-unblocking" },
      { label: "CCTV 照喉檢查", href: "/services/cctv-drain-inspection" },
      { label: "施工前資料清單", href: "/guide" },
    ],
    faqs: [
      {
        question: "交樓時去水正常，是否可以不用再理喉管？",
        answer:
          "一次試水只反映當時條件。入住後若出現反覆去水慢、回湧或可見漏水，仍應保留資料並評估；不能由交樓試水保證所有隱蔽管道正常。",
      },
      {
        question: "租客搬入前，可自行拆喉檢查嗎？",
        answer:
          "應先取得相關負責人的同意，不自行改動固定設備。可記錄可見異常，再確認施工授權及處理範圍。",
      },
      {
        question: "搬屋前通渠檢查一定包含 CCTV 照喉嗎？",
        answer:
          "不一定。是否照喉要按反覆問題、檢查目的、可用入口及視線條件評估，基本去水觀察和管內影像檢查是不同範圍。",
      },
    ],
  },
  {
    slug: "24-hour-shared-drain-backflow-coordination",
    title: "24小時通渠遇上共用渠倒灌：住戶與管理處如何協調？",
    category: "大廈渠務",
    date: "2026-10-09",
    readMins: 4,
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    featured: true,
    excerpt:
      "多個單位或公共位置同時污水倒灌，先停用受影響用水並通知管理處。整理位置、時間與可用入口，讓 24小時通渠查詢延續現場協調。",
    keywords: ["24小時通渠", "共用渠倒灌", "專業通渠", "大廈通渠"],
    serviceSlugs: [
      "sewage-backflow",
      "main-drain-manhole",
      "cctv-drain-inspection",
    ],
    relatedSlugs: [
      "building-main-drain-vs-unit-branch-pipe",
      "property-drain-maintenance-plan",
      "24-hour-drain-help-night",
    ],
    sections: [
      {
        type: "p",
        text: "多個單位或公共位置同時倒灌，應先停止受影響的用水，避免接觸污水，並通知管理處或現場負責人。搜尋 24小時通渠時，同步整理受影響位置和出現時間；不要只按某一戶最先報告，就直接判定堵塞在該戶或責任由該戶承擔。",
      },
      { type: "h2", text: "住戶先做甚麼，管理處協調甚麼？" },
      {
        type: "list",
        items: [
          "住戶：停止令水位上升的用水，安全拍攝現象，交代出現時間及位置。",
          "管理處或負責人：了解其他單位與公用位置的反映，協調進場、入口及現場聯絡。",
          "施工團隊：按可用入口及現象評估檢查範圍，說明處理方法和仍未確認的部分。",
        ],
      },
      { type: "h2", text: "夜間查詢，把範圍資料放在同一份紀錄" },
      {
        type: "p",
        text: "把受影響樓層、去水位置、開始時間和近期工程整理在一起。不要在群組或公開網站張貼住戶完整個人資料。若有人開另一個位置的水時出現回湧，也請說明，但不要刻意重現倒灌來取證，避免令污水影響擴大。",
      },
      { type: "h2", text: "公共道路與私人管道，不宜靠相片判責任" },
      {
        type: "p",
        text: "道路渠道、公用設施及大廈內部管道可能涉及不同管理範圍。若不清楚位置或管道界線，可由管理處或相關負責人向負責部門查詢。專業通渠的現場觀察能提供處理資料，但不應只憑污水出現在哪裡，便在網上判定業權或法律責任。",
      },
      { type: "h2", text: "要進入其他位置，先取得現場協調" },
      {
        type: "p",
        text: "檢查可能需要另一個清潔口、共用渠或下游位置。先確認誰能開門、哪些設備要停用及哪些住戶要配合試水。不要讓住戶自行進入沙井；無法使用某個入口時，也要記錄檢查限制，而不是把未看過的管段寫成已確認正常。",
      },
      {
        type: "tip",
        text: "通渠熊接受 24 小時查詢，上門時間按地區、人手和設備確認。大廈應急聯絡、住戶溝通及必要的緊急救援，不應因等待通渠安排而停止。",
      },
    ],
    resourceLinks: [
      { label: "污水倒灌處理", href: "/services/sewage-backflow" },
      { label: "物業管理查詢清單", href: "/customers/property-management" },
      { label: "主渠及沙井服務", href: "/services/main-drain-manhole" },
    ],
    faqs: [
      {
        question: "多戶倒灌時，只替一戶通渠是否就足夠？",
        answer:
          "未必。需要把其他單位和公共位置的現象一起整理，確認可檢查入口及受影響範圍，不能只由一個去水位決定整段共用渠的處理。",
      },
      {
        question: "污水由我家去水口湧出，就代表是我家支渠塞嗎？",
        answer:
          "不一定。出水位置不等於堵塞位置；要配合其他單位、用水時段及可檢查管段了解，亦不能據此直接判定責任。",
      },
      {
        question: "共用渠夜間倒灌，聯絡通渠後還需要通知管理處嗎？",
        answer:
          "需要由管理處或現場負責人協調公用入口、其他受影響位置及進場安排。通渠查詢不能代替大廈現場協調和必要的緊急處理。",
      },
    ],
  },
];

for (const article of SEO_ARTICLES) {
  article.coverImage = {
    url: `/images/blog/${article.slug}.webp`,
    alt: `AI 紙藝通渠熊插圖：${article.title}`,
    width: 1200,
    height: 676,
    srcSet: `/images/blog/${article.slug}-640.webp 640w, /images/blog/${article.slug}.webp 1200w`,
  };
}
