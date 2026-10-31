"use client";

import { useEffect, useRef, useState } from "react";
import { audienceOptions, materialConcernOptions, OTHER_OPTION, priorityOptions, problemOptions, proofOptions, treeConcernOptions, type Survey } from "@/lib/survey-form";

const empty: Survey = { email: "", name: "", phone: "", audience: "", problems: [], problemsOther: "", priority: "", treeConcern: "", treeConcernOther: "", materialConcerns: [], materialConcernsOther: "", proof: "", proofOther: "", consent: false, website: "" };
const processImages = [
  { src: "/process-shells.png", alt: "Vỏ hải sản đã qua sử dụng trên bờ biển" },
  { src: "/process-lab.png", alt: "Thao tác phối trộn vật liệu trong phòng thí nghiệm" },
  { src: "/biopave-porous-block.png", alt: "Cận cảnh cấu trúc rỗng của gạch thấm nước" },
  { src: "/process-landscape.png", alt: "Lối đi xanh trong công viên, minh họa không gian ứng dụng" },
];
const products = [
  { name: "BIOPAVE HEAVY", type: "Hạ tầng & lối đi", image: "/biopave-urban.png", alt: "Vỉa hè lát gạch có cây xanh, minh họa ứng dụng BIOPAVE Heavy", description: "Gạch lát thấm nước định hướng cho khu vực chịu tải, giúp nước mưa đi qua bề mặt thay vì đọng lại.", metric: "Mục tiêu nghiên cứu: >30 MPa · 2–12 mm/s", uses: "Vỉa hè · sân đậu xe · lối đi nội bộ" },
  { name: "BIOPAVE HOME & DECOR", type: "Ngôi nhà Việt", image: "/biopave-porous-block.png", alt: "Cận cảnh cấu trúc rỗng của một mẫu gạch thấm nước", description: "Bề mặt có độ ma sát và thoát nước nhanh, được phát triển cho những khu vực sinh hoạt hằng ngày.", metric: "Định hướng: chống trượt · dễ vệ sinh", uses: "Sân thượng · nhà tắm · sân phơi · sân vườn" },
  { name: "BIOPAVE BIO-TREE", type: "Không gian xanh", image: "/biotree-landscape.png", alt: "Gạch lát quanh bồn cây trong không gian cảnh quan", description: "Kết cấu rỗng được nghiên cứu để giữ nước mưa và nhả dần độ ẩm quanh rễ cây.", metric: "Định hướng: giữ nước · hỗ trợ độ ẩm", uses: "Bồn cây · vườn mái · cảnh quan đô thị" },
];
const sections = [
  { id: "top", label: "Trang đầu" },
  { id: "about", label: "Về dự án" },
  { id: "survey", label: "Khảo sát" },
  { id: "products", label: "Giải pháp" },
  { id: "video", label: "Video giới thiệu" },
  { id: "vision", label: "Giá trị mới" },
  { id: "gallery", label: "Hình ảnh dự án" },
  { id: "lab", label: "Living Lab" },
  { id: "contact", label: "Liên hệ" },
];

const INTRO_VIDEO_EMBED_URL = "https://www.youtube.com/embed/t-re7ljv_cE?autoplay=1&playsinline=1";

export default function Home() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Survey>(empty);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [demo, setDemo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState("Trang đầu");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const productsRef = useRef<HTMLElement>(null);
  const surveyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    let hideTimer = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const probe = window.scrollY + window.innerHeight * 0.42;
        let current = sections[0].label;
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top + window.scrollY <= probe) current = section.label;
        }
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setActiveSection((previous) => previous === current ? previous : current);
        setScrollProgress(Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)));
      });
    };
    const onScroll = () => {
      update();
      window.clearTimeout(hideTimer);
      setShowScrollIndicator(window.scrollY > 80);
      if (window.scrollY > 80) hideTimer = window.setTimeout(() => setShowScrollIndicator(false), 1700);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  function setField<K extends keyof Survey>(field: K, value: Survey[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }
  function toggleChoice(field: "problems" | "materialConcerns", value: string) {
    setForm((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
    setError("");
  }
  function next() {
    if (step === 0 && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || !form.name.trim() || !form.phone.trim() || !form.audience)) {
      setError("Vui lòng nhập email hợp lệ, họ tên, số điện thoại và chọn nhóm đối tượng."); return;
    }
    if (step === 1 && (!form.problems.length || !form.priority || (form.problems.includes(OTHER_OPTION) && !form.problemsOther.trim()))) {
      setError("Vui lòng chọn khó khăn gặp phải, ưu tiên cải tạo và điền rõ Mục khác nếu có."); return;
    }
    setStep((current) => Math.min(2, current + 1));
    setError("");
    surveyRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.treeConcern || !form.materialConcerns.length || !form.proof ||
      (form.treeConcern === OTHER_OPTION && !form.treeConcernOther.trim()) ||
      (form.materialConcerns.includes(OTHER_OPTION) && !form.materialConcernsOther.trim()) ||
      (form.proof === OTHER_OPTION && !form.proofOther.trim())) {
      setError("Vui lòng trả lời đủ các câu hỏi và điền rõ Mục khác nếu có."); return;
    }
    if (!form.consent) { setError("Vui lòng đồng ý trước khi gửi."); return; }
    setSending(true); setError("");
    try {
      const response = await fetch("/api/survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Failed to submit");
      setSent(true);
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 450);
    } catch {
      setError("Chưa gửi được ý kiến. Vui lòng thử lại sau.");
    } finally { setSending(false); }
  }
  function multiChoice(field: "problems" | "materialConcerns", otherField: "problemsOther" | "materialConcernsOther", questionText: string, options: readonly string[]) {
    return <fieldset className="field"><legend className="field-label">{questionText} <b>*</b></legend>{options.map((option) => <label className="choice" key={option}><input type="checkbox" checked={form[field].includes(option)} onChange={() => toggleChoice(field, option)} /><span>{option}</span></label>)}<label className="choice"><input type="checkbox" checked={form[field].includes(OTHER_OPTION)} onChange={() => toggleChoice(field, OTHER_OPTION)} /><span>Mục khác</span></label>{form[field].includes(OTHER_OPTION) && <input className="other-answer" aria-label={`Mục khác: ${questionText}`} maxLength={2000} placeholder="Vui lòng ghi rõ..." value={form[otherField]} onChange={(e) => setField(otherField, e.target.value)} />}</fieldset>;
  }
  function singleChoice(field: "priority" | "treeConcern" | "proof", questionText: string, options: readonly string[], otherField?: "treeConcernOther" | "proofOther") {
    return <fieldset className="field"><legend className="field-label">{questionText} <b>*</b></legend>{options.map((option) => <label className="choice" key={option}><input type="radio" name={field} value={option} checked={form[field] === option} onChange={() => setField(field, option)} /><span>{option}</span></label>)}{otherField && <><label className="choice"><input type="radio" name={field} value={OTHER_OPTION} checked={form[field] === OTHER_OPTION} onChange={() => setField(field, OTHER_OPTION)} /><span>Mục khác</span></label>{form[field] === OTHER_OPTION && <input className="other-answer" aria-label={`Mục khác: ${questionText}`} maxLength={2000} placeholder="Vui lòng ghi rõ..." value={form[otherField]} onChange={(e) => setField(otherField, e.target.value)} />}</>}</fieldset>;
  }

  return <main>
    <header className="header"><a href="#top" className="logo" aria-label="BIOPAVE"><span className="logo-mark">B</span> BIOPAVE<span className="logo-dot">.</span></a><nav aria-label="Điều hướng chính"><a href="#about">Về dự án</a><a href="#survey">Khảo sát</a><a href="#products">Giải pháp</a><a href="#contact">Liên hệ</a></nav><a className="header-cta" href="#survey">Tham gia khảo sát <span>↗</span></a></header>

    <section className="hero" id="top"><div className="hero-image" aria-hidden="true" /><div className="hero-shade" aria-hidden="true" /><div className="container hero-content"><span className="eyebrow eyebrow-light">DỰ ÁN NGHIÊN CỨU VẬT LIỆU XANH · ĐẠI HỌC CẦN THƠ</span><span className="hero-word">BIOPAVE</span><h1>Không gian sống khô ráo.<br/><em>Tương lai bền vững.</em></h1><p>Cùng định hình thế hệ gạch sinh thái thấm nước từ phụ phẩm tái chế.</p><div className="hero-actions"><a className="button button-primary" href="#survey">Chia sẻ ý kiến của bạn <span>↗</span></a><a className="hero-text-link" href="#about">Khám phá BIOPAVE <span>↓</span></a></div></div><div className="hero-bottom container"><span>01 / 04</span><span>CUỘN ĐỂ KHÁM PHÁ ↓</span></div></section>

    <section className="intro section-pad" id="about"><div className="container intro-grid"><div><span className="eyebrow">LẮNG NGHE ĐỂ TẠO RA THAY ĐỔI</span><h2>Một viên gạch bắt đầu từ <em>câu chuyện của bạn.</em></h2><div className="accent-line" /><figure className="team-photo"><img src="/biopave-team.png" alt="Ba thành viên nhóm nghiên cứu BIOPAVE tại khu trưng bày dự án" loading="lazy" /><figcaption>NHÓM NGHIÊN CỨU BIOPAVE · ĐẠI HỌC CẦN THƠ</figcaption></figure></div><div className="intro-copy"><p>Mưa lớn làm sân nhà đọng nước. Nắng gắt khiến bề mặt nóng lên. Từ những vấn đề rất gần gũi ấy, nhóm nghiên cứu trẻ tại Đại học Cần Thơ đang phát triển BIOPAVE — dòng gạch sinh thái thấm nước từ vỏ hải sản và tro xỉ tái chế.</p><p>Chúng tôi muốn nghe trải nghiệm thật của chuyên gia và người sử dụng để hoàn thiện vật liệu phù hợp hơn với không gian sống Việt Nam. Mỗi chia sẻ đều giúp ích cho giai đoạn nghiên cứu.</p><p>Những câu chuyện về vũng nước sau mưa, bề mặt nóng hoặc trơn, và việc vệ sinh mỗi ngày giúp nhóm xác định điều gì cần ưu tiên khi thiết kế. Các băn khoăn về độ bền, độ an toàn và vẻ ngoài của vật liệu tái chế cũng là những câu hỏi cần được kiểm chứng bằng mẫu thử.</p><div className="listening-points"><span>CHÚNG TÔI MUỐN LẮNG NGHE</span><div><b>01</b><p>Không gian nào đang gây bất tiện cho bạn?</p></div><div><b>02</b><p>Tiêu chí nào quan trọng nhất khi cải tạo?</p></div><div><b>03</b><p>Bạn cần thấy bằng chứng gì trước khi sử dụng?</p></div></div><a className="inline-link" href="#survey">Góp ý cho BIOPAVE ↗</a></div></div><div className="container stats"><div><strong>03</strong><span>hướng ứng dụng đang nghiên cứu</span></div><div><strong>05</strong><span>câu hỏi trọng tâm</span></div><div><strong>01′</strong><span>thời gian chia sẻ dự kiến</span></div></div></section>

    <section className="survey section-pad" id="survey" ref={surveyRef}><div className="container survey-layout"><div className="survey-intro"><span className="eyebrow">KHẢO SÁT CHUYÊN SÂU</span><h2>Ý kiến của bạn là <em>nền móng</em> của BIOPAVE.</h2><p>Hãy chia sẻ những điều bạn thật sự gặp phải. Không có câu trả lời đúng hay sai.</p><div className="survey-quote">“Ý kiến thực tế của bạn giúp chúng tôi tạo ra vật liệu phù hợp hơn cho ngôi nhà Việt.”</div></div><div className="survey-card">{sent ? <div className="thanks" role="status"><div className="thanks-icon">✓</div><span className="eyebrow">CẢM ƠN BẠN</span><h3>Mỗi chia sẻ là một bước tiến.</h3><p>Cảm ơn bạn đã dành thời gian góp ý. Hãy khám phá ba hướng ứng dụng mà BIOPAVE đang phát triển.</p><button type="button" className="button button-dark" onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}>Khám phá giải pháp ↓</button></div> : <form onSubmit={submit} noValidate><div className="form-progress"><span>BƯỚC <strong>0{step + 1}</strong> / 03</span><div className="progress-dots" aria-hidden="true">{[0,1,2].map((i) => <i key={i} className={i <= step ? "filled" : ""} />)}</div></div><div className="step-names"><span className={step === 0 ? "current" : ""}>Thông tin</span><span className={step === 1 ? "current" : ""}>Trải nghiệm</span><span className={step === 2 ? "current" : ""}>Kỳ vọng</span></div>
      {step === 0 && <div className="form-fields">
        <label className="field" htmlFor="email"><span className="field-label">Email <b>*</b></span><input id="email" type="email" autoComplete="email" maxLength={254} placeholder="Email của bạn" value={form.email} onChange={(e) => setField("email", e.target.value)} /></label>
        <label className="field" htmlFor="name"><span className="field-label">Họ và tên <b>*</b></span><input id="name" autoComplete="name" maxLength={120} placeholder="Nhập họ và tên" value={form.name} onChange={(e) => setField("name", e.target.value)} /></label>
        <label className="field" htmlFor="phone"><span className="field-label">Sđt <b>*</b></span><input id="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Số điện thoại của bạn" value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></label>
        <fieldset className="field"><legend className="field-label">Bạn thuộc nhóm nào? <b>*</b></legend>{audienceOptions.map((option) => <label className="choice" key={option}><input type="radio" name="audience" value={option} checked={form.audience === option} onChange={() => setField("audience", option)} /><span>{option}</span></label>)}</fieldset>
        <p className="privacy">Câu trả lời của bạn sẽ được gửi đến Google Form của nhóm BIOPAVE sau khi bạn đồng ý.</p>
      </div>}
      {step === 1 && <div className="form-fields">
        {multiChoice("problems", "problemsOther", "Trong quá trình sinh hoạt & chăm sóc sân nhà, sân thượng, nhà tắm hay bồn cây, Anh/Chị gặp phiền ngoái hoặc khó khăn gì nhất khi mưa lớn hoặc nắng nóng gay gắt?", problemOptions)}
        {singleChoice("priority", "Khi cân nhắc cải tạo sân thượng, sân vườn hoặc nhà tắm, Anh/Chị ưu tiên yếu tố nào nhất?", priorityOptions)}
      </div>}
      {step === 2 && <div className="form-fields">
        {singleChoice("treeConcern", "Anh/Chị đánh giá thế nào về loại gạch ốp bồn cây có khả năng ngậm giữ nước mưa để nhả dần độ ẩm nuôi cây trong những ngày nắng hạn? E ngại lớn nhất khiến Anh/Chị e ngại khi dùng loại gạch này là gì?", treeConcernOptions, "treeConcernOther")}
        {multiChoice("materialConcerns", "materialConcernsOther", "Khi nghe một sản phẩm VLXD được làm hoàn toàn từ phụ phẩm tái chế như vỏ hải sản và tro xỉ, cảm nhận hoặc băn khoăn đầu tiên của Anh/Chị về độ bền, an toàn vệ sinh hay thẩm mỹ là gì?", materialConcernOptions)}
        {singleChoice("proof", "Nếu có loại gạch giúp không gian luôn khô ráo ngay sau mưa, giảm nhiệt sàn mát nhà mà giá ngang bằng gạch gốm/ceramic, Anh/Chị muốn được trải nghiệm hoặc kiểm chứng điều gì thực tế nhất trước khi mua?", proofOptions, "proofOther")}
        <label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => setField("consent", e.target.checked)} /><span>Tôi đồng ý gửi email, số điện thoại và câu trả lời này đến Google Form của nhóm BIOPAVE để phục vụ nghiên cứu và liên hệ khi cần.</span></label>
        <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField("website", e.target.value)} /></label>
      </div>}
      {error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 0 && <button type="button" className="button button-back" onClick={() => { setStep(step - 1); setError(""); }}>Quay lại</button>}{step < 2 ? <button type="button" className="button button-dark" onClick={next}>Tiếp tục →</button> : <button type="submit" className="button button-dark" disabled={sending}>{sending ? "Đang gửi..." : "Gửi ý kiến & xem giải pháp ↗"}</button>}</div></form>}</div></div></section>

    <section className="products section-pad" id="products" ref={productsRef}><div className="container"><div className="section-heading"><span className="eyebrow">GIẢI PHÁP ĐANG PHÁT TRIỂN</span><h2>Một vật liệu, <em>nhiều không gian sống.</em></h2><p>Ba dòng sản phẩm được định hướng cho những nhu cầu khác nhau — từ hạ tầng đô thị đến góc vườn tại nhà.</p></div><div className="product-grid">{products.map((product, i) => <button type="button" key={product.name} className={`product-card ${activeProduct === i ? "selected" : ""}`} aria-pressed={activeProduct === i} onClick={() => setActiveProduct(i)}><span className="product-number">0{i + 1} / 03</span><span className="product-art"><img src={product.image} alt={product.alt} loading="lazy" /><span className="image-label">ẢNH MINH HỌA</span></span><span className="product-type">{product.type}</span><strong>{product.name}</strong><span className="product-arrow">↗</span></button>)}</div><div className="product-detail"><div><span className="eyebrow">{products[activeProduct].name}</span><h3>{products[activeProduct].description}</h3></div><div><p className="metric">{products[activeProduct].metric}</p><span className="detail-label">KHÔNG GIAN ỨNG DỤNG</span><p>{products[activeProduct].uses}</p></div></div></div></section>

    <section className="video-section section-pad" id="video"><div className="container video-grid"><div className="video-copy"><span className="eyebrow">VIDEO GIỚI THIỆU</span><h2>Nhìn thấy dòng nước <em>thấm qua BIOPAVE.</em></h2><p>Video giới thiệu sẽ giúp bạn theo dõi trực quan cách gạch thấm nước và khám phá quá trình nhóm nghiên cứu phát triển sản phẩm.</p></div><div className="video-frame">{videoPlaying ? <iframe src={INTRO_VIDEO_EMBED_URL} title="Video giới thiệu sản phẩm BIOPAVE" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <button type="button" className="video-placeholder" aria-label="Phát video giới thiệu BIOPAVE" onClick={() => setVideoPlaying(true)}><span className="video-play" aria-hidden="true">▶</span><strong>Video giới thiệu BIOPAVE</strong><span>Nhấn để phát video</span></button>}</div></div></section>

    <section className="vision section-pad" id="vision"><div className="container"><div className="section-heading"><span className="eyebrow">KINH TẾ TUẦN HOÀN</span><h2>Từ phụ phẩm thành <em>giá trị mới.</em></h2><p>BIOPAVE nghiên cứu tái sử dụng vỏ hải sản và tro xỉ nhiệt điện để tạo vật liệu xây dựng có vòng đời hữu ích hơn.</p></div><div className="process">{["Phụ phẩm vỏ hải sản", "Xử lý & phối trộn", "Gạch sinh thái BIOPAVE", "Không gian khô ráo hơn"].map((item, i) => <div className="process-step" key={item}><span>0{i + 1}</span><img src={processImages[i].src} alt={processImages[i].alt} loading="lazy" /><strong>{item}</strong></div>)}</div><div className="pillar-grid"><article><small>01 / MATERIAL</small><h3>Tái sử dụng nguyên liệu</h3><p>Nghiên cứu xử lý phụ phẩm và tạp chất trước khi đưa vào vật liệu.</p></article><article><small>02 / COMFORT</small><h3>Hướng tới bề mặt mát hơn</h3><p>Mục tiêu thử nghiệm giảm nhiệt độ bề mặt khoảng 3–5°C nhờ lưu giữ độ ẩm.</p></article><article><small>03 / WATER</small><h3>Thoát nước tại chỗ</h3><p>Cấu trúc thấm nước nhằm hạn chế vũng đọng sau mưa.</p></article></div></div></section>

    <section className="gallery section-pad" id="gallery" aria-labelledby="gallery-heading"><div className="container gallery-grid"><div className="gallery-copy"><span className="eyebrow">HÌNH ẢNH DỰ ÁN</span><h2 id="gallery-heading">Từ ý tưởng đến <em>mẫu thử.</em></h2><p>Những hình ảnh dưới đây cho thấy hướng ứng dụng gạch quanh bồn cây và bộ mẫu vật liệu của nhóm BIOPAVE. Hình ảnh cảnh quan dùng để minh họa ý tưởng ứng dụng.</p><div className="gallery-photos"><figure><img src="/biotree-detail.png" alt="Gạch lát bao quanh một bồn cây, minh họa ứng dụng Bio-Tree" loading="lazy" /><figcaption>Minh họa ứng dụng Bio-Tree</figcaption></figure><figure><img src="/biopave-sample-kit.png" alt="Bộ mẫu gạch BIOPAVE của nhóm nghiên cứu" loading="lazy" /><figcaption>Bộ mẫu thử của nhóm</figcaption></figure></div></div><figure className="poster-figure"><img src="/biopave-poster.png" alt="Poster giới thiệu dự án gạch lát sinh thái BIOPAVE" loading="lazy" /><figcaption>POSTER GIỚI THIỆU DỰ ÁN BIOPAVE</figcaption></figure></div></section>

    <section className="lab section-pad" id="lab"><div className="container lab-grid"><div><span className="eyebrow">LIVING LAB · CẦN THƠ</span><h2>Kiểm chứng bằng <em>trải nghiệm thật.</em></h2><p>Nhóm nghiên cứu đang hoàn thiện mẫu thử và mô hình Living Lab tại Cần Thơ. Chúng tôi muốn để người dùng nhìn, chạm và thử khả năng thấm nước trước khi đưa sản phẩm ra quy mô lớn.</p><a className="inline-link" href="#contact">Hỏi về bộ mẫu thử ↗</a></div><div className={`demo-card ${demo ? "running" : ""}`}><span className="demo-label">MINH HỌA NGUYÊN LÝ THẤM NƯỚC</span><div className="demo-scene" aria-hidden="true"><i className="drop d1" /><i className="drop d2" /><i className="drop d3" /><i className="tile-top" /><i className="tile-side" /><i className="drain r1" /><i className="drain r2" /><i className="drain r3" /></div><p>Nhấn để xem nước đi qua bề mặt</p><button type="button" className="button button-outline" onClick={() => { setDemo(false); setTimeout(() => setDemo(true), 20); }}>{demo ? "Thử lại ↗" : "Rót nước thử ↗"}</button></div></div></section>

    <footer className="footer" id="contact"><div className="container footer-grid"><div><span className="eyebrow eyebrow-light">CÙNG TẠO NÊN KHÔNG GIAN TỐT HƠN</span><h2>Muốn tự tay trải nghiệm BIOPAVE?</h2><p>Liên hệ nhóm để tìm hiểu về mẫu thử, quá trình nghiên cứu hoặc cơ hội đồng hành cùng dự án.</p><div className="footer-actions"><a className="button button-primary" href="https://zalo.me/0936813932" target="_blank" rel="noopener noreferrer">Hỏi về bộ mẫu thử ↗</a><a className="button button-outline" href="tel:+84936813932">Gọi 0936 813 932 ↗</a></div></div><div className="footer-meta"><span className="footer-logo">BIOPAVE<span>.</span></span><p>Dự án phát triển bởi nhóm nghiên cứu Đại học Cần Thơ</p><p>Cố vấn chuyên môn: TS. Nguyễn Quốc Châu Thanh</p><p>Hotline / Zalo: <a href="tel:+84936813932">0936 813 932</a></p></div></div><div className="container footer-bottom"><span>© 2026 BIOPAVE</span><span>CAN THO, VIET NAM</span><a href="#top">VỀ ĐẦU TRANG ↑</a></div></footer>
    <div className="site-credit"><div className="container site-credit-inner"><span className="site-credit-label">WEBSITE ĐƯỢC THỰC HIỆN BỞI</span><strong>Gia Khánh</strong><a href="mailto:giakhanhtran88@gmail.com">giakhanhtran88@gmail.com <span aria-hidden="true">↗</span></a></div></div>
    <div
      className={`scroll-indicator ${showScrollIndicator ? "is-visible" : ""}`}
      style={{ "--scroll-progress": `${scrollProgress}%` } as React.CSSProperties}
      aria-hidden={!showScrollIndicator}
    >
      <div className="scroll-indicator-copy"><span>ĐANG XEM</span><strong>{activeSection}</strong></div>
      <div className="scroll-indicator-track" role="progressbar" aria-label="Tiến độ cuộn trang" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scrollProgress)}><span /></div>
    </div>
  </main>;
}
