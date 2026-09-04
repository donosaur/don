
    // ── Hero headline rotation ──
    (function () {
      const headlines = window.heroHeadlines || [
        { lines: ['15+ years shaping', 'how people'], em: 'watch video.', jpLines: ['15年以上にわたり', '人々の映像体験を'], jpEm: '創造する。' },
      ];
      const key = 'hlIdx';
      let idx = parseInt(localStorage.getItem(key) || '0') % headlines.length;
      localStorage.setItem(key, (idx + 1) % headlines.length);

      window.updateHeroHeadline = function () {
        const h = headlines[idx];
        const h1 = document.querySelector('.hero h1');
        if (!h1) return;

        let textChunks = [];
        if (window.isJapanese) {
          textChunks = [
            { text: h.jpLines[0] },
            { text: h.jpLines[1] },
            { text: h.jpEm, em: true }
          ];
        } else {
          const l1 = h.lines[0].split(' ').map(w => ({ text: w }));
          const l2 = h.lines[1].split(' ').map(w => ({ text: w }));
          const emWords = h.em.split(' ').map(w => ({ text: w + '<span style="opacity:0.001">.</span>', em: true }));
          textChunks = [...l1, ...l2, ...emWords];
        }

        let html = '';
        textChunks.forEach((chunk, i) => {
          let delay = 0.1 + (i * 0.06);
          let margin = window.isJapanese ? 'margin-right: -0.5em;' : 'margin-right: -0.28em;';
          if (chunk.em) {
            html += `<span class="h1-line" style="${margin}"><span class="h1-line-inner" style="animation-delay:${delay}s"><span class="hero-title-em">${chunk.text}</span></span></span>`;
          } else {
            html += `<span class="h1-line" style="${margin}"><span class="h1-line-inner" style="animation-delay:${delay}s">${chunk.text}</span></span>`;
          }
        });

        // 1. Measure current height
        const oldHeight = h1.offsetHeight;

        // 2. Set new HTML to measure new height invisibly, but disable transition first
        h1.style.transition = 'none';
        h1.innerHTML = html;
        const newHeight = h1.offsetHeight;

        // 3. Revert to old height
        h1.style.height = oldHeight + 'px';
        h1.offsetHeight; // force reflow

        // 4. Animate to new height
        h1.style.transition = 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        h1.style.height = newHeight + 'px';

        // 5. Clean up afterwards so it scales normally on window resize
        setTimeout(() => {
          h1.style.transition = '';
          h1.style.height = '';
        }, 800);
      };

      function setHeadline(h) {
        window.updateHeroHeadline();
      }

      function animateIn() {
        const lineEls = document.querySelectorAll('.hero h1 .h1-line-inner');
        lineEls.forEach((el, i) => {
          el.style.animation = 'none';
          el.style.opacity = '0';
          el.style.transform = 'translateY(110%)';
          el.offsetHeight; // force reflow
          el.style.animation = '';
        });
      }

      const h1El = document.querySelector('.hero h1');
      if (h1El) {
        setHeadline(headlines[idx]);

        setInterval(function () {
          idx = (idx + 1) % headlines.length;
          localStorage.setItem(key, (idx + 1) % headlines.length);
          setHeadline(headlines[idx]);
          animateIn();
        }, 10000);
      }
    })();

    // ── Mobile menu ──
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const btn = document.getElementById('hamburger');
      menu.classList.toggle('open');
      btn.classList.toggle('open');
      document.querySelector('nav').classList.toggle('menu-open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    }
    function closeMobileMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.querySelector('nav').classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    // ── Nav scroll state ──
    const nav = document.querySelector('nav');
    function updateNav() {
      nav.classList.toggle('at-top', window.scrollY < 80);
    }
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    // ── Kinetic typography: cursor parallax + continuous drift ──
    const heroEl = document.querySelector('.hero');
    const h1Lines = document.querySelectorAll('.h1-line-inner');

    // per-line config: [parallaxStrength, floatAmplitude, floatSpeed, floatPhase]
    const cfg = [
      [14, 2.2, 0.9, 0.0],
      [20, 1.8, 1.1, 1.4],
      [10, 2.8, 0.7, 2.6],
    ];

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let time = 0;

    document.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      targetX = (e.clientX - r.left - r.width / 2) / r.width;
      targetY = (e.clientY - r.top - r.height / 2) / r.height;
    });

    function tick() {
      time += 0.007;
      // smooth lerp toward cursor
      curX += (targetX - curX) * 0.055;
      curY += (targetY - curY) * 0.055;

      h1Lines.forEach((line, i) => {
        const [str, amp, spd, phase] = cfg[i];
        const floatY = Math.sin(time * spd + phase) * amp;
        const floatX = Math.cos(time * spd * 0.6 + phase) * (amp * 0.4);
        const tx = curX * str + floatX;
        const ty = curY * (str * 0.55) + floatY;
        line.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      // video parallax — moves opposite to text for depth
      const videoBg = heroEl.querySelector('.hero-video-bg');
      if (videoBg) {
        videoBg.style.transform = `translate(${curX * -18}px, ${curY * -10}px)`;
      }

      requestAnimationFrame(tick);
    }



    // load vimeo thumbnail via oEmbed
    fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/4626028&width=800')
      .then(r => r.json())
      .then(data => {
        const img = document.getElementById('vimeo-thumb-img-4626028');
        const titleEl = document.getElementById('vimeo-title-4626028');
        if (img && data.thumbnail_url) {
          img.src = data.thumbnail_url;
          img.style.display = 'block';
        }
        // title is set statically, don't overwrite
      })
      .catch(() => { });

    // contract timeline: click dot to expand
    document.querySelectorAll('.timeline-dot--contract').forEach(dot => {
      dot.addEventListener('click', () => {
        dot.closest('.timeline-item--contract').classList.toggle('is-open');
      });
    });

    // emoji cursor for clover-hover span
    (function () {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.font = '26px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍀', 16, 16);
      const url = canvas.toDataURL();
      const style = document.createElement('style');
      style.textContent = `.clover-hover { cursor: url("${url}") 16 16, auto !important; }`;
      document.head.appendChild(style);
    })();

    // ── Japanese Translation Easter Egg ──
    let isJapanese = false;
    const jpMap = [
      // Nav
      { sel: '.nav-links a[href="#work"]', jp: '作品' },
      { sel: '.nav-links a[href="#about"]', jp: '紹介' },
      { sel: '.nav-links a[href="#career"]', jp: '経歴' },
      { sel: '.nav-links a[href="#contact"]', jp: '連絡' },
      // Mobile menu
      { sel: '.mobile-menu a[href="#work"]', jp: '作品' },
      { sel: '.mobile-menu a[href="#about"]', jp: '紹介' },
      { sel: '.mobile-menu a[href="#career"]', jp: '経歴' },
      { sel: '.mobile-menu a[href="#contact"]', jp: '連絡' },
      // Hero
      { sel: '.hero-label', jp: 'プロダクトデザイナー · ブルックリン、ニューヨーク' },
      { sel: '.hero-cta-text', jp: '次のステージへ、話しましょう！' },
      { sel: '.hero-stat:nth-child(1) .hero-stat-label', jp: 'クロスプラットフォーム専門家' },
      { sel: '.hero-stat:nth-child(2) .hero-stat-label', jp: '買収された企業' },
      { sel: '.hero-stat:nth-child(2) .hero-stat-num', jp: '2回' },
      { sel: '.hero-stat:nth-child(3) .hero-stat-label', html: '世界中の<span class="hide-mobile-sm">到達した</span>視聴者数', enHtml: 'viewers <span class="hide-mobile-sm">reached </span>worldwide' },
      { sel: '.hero-stat:nth-child(3) .hero-stat-num', jp: '数百万' },
      { sel: '.hero-stat:nth-child(4) .hero-stat-label', jp: 'AIワークフロー & コンシューマーエレクトロニクス' },
      // Work section
      { sel: '#work > h2', html: 'ケーススタディと<br>ハイライト。' },
      { sel: '.work-intro', jp: '各プロジェクトは独自のデザイン課題を表しています — 新しいプラットフォーム向けのUXパターンの創造から、変革期の企業におけるデザインシステムの拡張まで。' },
      // Vimeo card
      { sel: '#card-vimeo .work-card-type', jp: 'プラットフォームデザイン · Vimeo' },
      { sel: '#card-vimeo .work-card-title', jp: 'Vimeo ストリーミング' },
      { sel: '#card-vimeo .work-card-desc', jp: 'Vimeo OTT配信プロダクトのエンドツーエンドデザインを設計 — クリエイターに、独自のストリーミングチャンネルの立ち上げと運営を可能にするツールを提供。' },
      { sel: '#card-vimeo .work-card-stat:nth-child(1) span', jp: '年間クリエイター収益' },
      { sel: '#card-vimeo .work-card-stat:nth-child(2) span', jp: 'プラットフォーム' },
      { sel: '#card-vimeo .work-card-stat:nth-child(3) span', jp: 'チャンネル数' },
      // Looking Glass card
      { sel: '#card-lookingglass .work-card-type', jp: '新技術 · Looking Glass' },
      { sel: '#card-lookingglass .work-card-title', jp: 'Looking Glass Go モバイルアプリ' },
      { sel: '#card-lookingglass .work-card-desc', jp: 'ホログラフィックディスプレイ用iOSコンパニオンアプリのデザイン — 奥行き、AI生成3D、ハードウェア状態管理について根本から考える、まったく新しい領域。' },
      { sel: '#card-lookingglass .work-card-stat:nth-child(1) span', jp: 'モバイルアプリ' },
      { sel: '#card-lookingglass .work-card-stat:nth-child(2) span', jp: 'AI変換' },
      { sel: '#card-lookingglass .work-card-stat:nth-child(3) span', jp: '出荷済み' },
      // Boxee card
      { sel: '#card-boxee .work-card-type', jp: '0→1 プロダクト · Boxee' },
      { sel: '#card-boxee .work-card-title', jp: 'クラウドDVR体験' },
      { sel: '#card-boxee .work-card-desc', jp: 'Boxeeでのクラウド DVR UXの先駆け — 録画フロー、スケジュールインターフェース、ソーシャルTV機能をデザイン。時代を先取りしたリビングルーム向けプロダクト。Samsung による買収に至る。' },
      { sel: '#card-boxee .work-card-stat:nth-child(1) span', jp: 'クラウドDVR UX' },
      { sel: '#card-boxee .work-card-stat:nth-child(1) strong', jp: '0→1' },
      { sel: '#card-boxee .work-card-stat:nth-child(2) span', jp: 'テレビUI' },
      { sel: '#card-boxee .work-card-stat:nth-child(3) span', jp: 'Samsung買収' },
      // VHX card
      { sel: '#card-vhx .work-card-type', jp: 'D2Cプラットフォーム · VHX' },
      { sel: '#card-vhx .work-card-title', jp: 'クリエイター収益化ツール' },
      { sel: '#card-vhx .work-card-desc', jp: 'VHXの決済・視聴者管理フローのデザイン — インディー映画制作者やクリエイターが独自のストリーミングビジネスを運営するためのインフラ。後にVimeoプラットフォームに統合。' },
      { sel: '#card-vhx .work-card-stat:nth-child(1) span', jp: '動画コマース' },
      { sel: '#card-vhx .work-card-stat:nth-child(2) span', jp: 'Vimeo買収' },
      { sel: '#card-vhx .work-card-stat:nth-child(3) span', jp: '出荷済み' },
      // Script thesis card
      { sel: '.work-grid .work-card:nth-child(5) .work-card-type', jp: '卒業制作 · MICA 2009' },
      { sel: '.work-grid .work-card:nth-child(5) .work-card-title', jp: 'Script' },
      { sel: '.work-grid .work-card:nth-child(5) .work-card-desc', jp: 'シュテンペル論文賞受賞：優れた卒業制作を発表したMICA4年生に毎年授与される奨学金。' },
      { sel: '.work-grid .work-card:nth-child(5) .work-card-stat span', jp: 'Vimeo.com' },
      // About section
      { sel: '#about h2', html: '映像と<br>プラットフォームの深い技。' },
      { sel: '.pull-quote', jp: '「映像が私の出発点でした。プラットフォーム思考こそが刺激を与えてくれるものです。画面、ヘッドセット、ホログラム — 表面は常に変わり続け、私はその先端にいたいと思っています。」' },
      { sel: '.about-text > p', jp: 'こんにちは、ドンです。ブルックリンを拠点とするプロダクトデザイナーで、15年以上ストリーミングビデオと家電に携わってきました。Boxeeの10フィートTVインターフェースのデザインから始まり、SamsungのSmart TVへの統合、VimeoのOTTクリエイタープラットフォームの構築に至るまで。Looking Glassでのホログラフィックディスプレイのデザインや、AIツールを活用したデザインプロセスにも取り組んでいます。' },
      { sel: '.about-tools h3:first-of-type', jp: 'スキルと技術' },
      { sel: '.about-tools h3:last-of-type', jp: 'コア・ストレングス' },
      { sel: '.about-tools > p', jp: '次の役割では、複雑なデザイン課題を解決するチームを探しています。OTT/動画プラットフォームのデザイン、クロスプラットフォームエコシステムの開発、デザインシステムの構築、スタートアップ買収とプロダクト統合、新しいハードウェアと空間デザインの分野で15年の経験があります。' },
      // Skill tags
      { sel: '.tool-tag:nth-child(1)', jp: '10フィートUI' },
      { sel: '.tool-tag:nth-child(2)', jp: 'クロスプラットフォーム' },
      { sel: '.tool-tag:nth-child(3)', jp: 'デザインシステム' },
      { sel: '.tool-tag:nth-child(4)', jp: 'AIプロトタイピング' },
      { sel: '.tool-tag:nth-child(5)', jp: 'コンシューマーエレクトロニクス' },
      { sel: '.tool-tag:nth-child(6)', jp: '収益化フロー' },
      { sel: '.tool-tag:nth-child(7)', jp: '新技術' },
      { sel: '.tool-tag:nth-child(8)', jp: '0→1' },
      { sel: '.tool-tag:nth-child(9)', jp: 'ライガーを描く' },
      // Career section
      { sel: '#career > h2', jp: 'ここに至るまで。' },
      { sel: '.career-intro', jp: '私のデザインの旅は小さなハードウェアスタートアップから始まり、大規模なストリーミングプラットフォームへと発展しました。すべてのステップで多くを学びました。2度の買収を経ても、プロダクトと共に歩み、私たちの仕事が人々に届き続けるようにしました。' },
      // Timeline – Boxee
      { sel: '.timeline-item:nth-child(1) .timeline-period', jp: '2010年7月 – 2013年7月' },
      { sel: '.timeline-item:nth-child(1) .timeline-role', jp: 'デザイナー · ニューヨーク、NY' },
      { sel: '.timeline-item:nth-child(1) .timeline-desc', jp: 'すべてはここから始まりました。Boxeeでは、ストリーミング分野がまだ黎明期だった頃に、初期のクラウドDVRやソーシャルTV機能のデザインを手がけました。ハードウェアのパッケージングやマーケティングにも貢献。2013年、SamsungがBoxeeを買収し、共に築いたプロダクトにとって素晴らしい次のステップとなりました。' },
      { sel: '.timeline-item:nth-child(1) .tag:nth-child(1)', jp: 'クラウドDVR' },
      { sel: '.timeline-item:nth-child(1) .tag:nth-child(2)', jp: 'ソーシャルTV' },
      { sel: '.timeline-item:nth-child(1) .tag:nth-child(3)', jp: '0→1' },
      { sel: '.timeline-item:nth-child(1) .tag:nth-child(4)', jp: 'ハードウェアローンチ' },
      { sel: '.timeline-item:nth-child(1) .tag:nth-child(5)', jp: 'Samsungに買収' },
      // Timeline – Samsung
      { sel: '.timeline-item:nth-child(2) .timeline-period', jp: '2013年7月 – 2015年11月' },
      { sel: '.timeline-item:nth-child(2) .timeline-role', jp: 'シニアプロダクトデザイナー · ニューヨーク、NY' },
      { sel: '.timeline-item:nth-child(2) .timeline-desc', jp: 'SamsungによるBoxee買収後、Samsungのスマートテレビエコシステム向けにマルチスクリーン体験をデザイン — BoxeeソフトウェアをSamsungのTVインターフェースに統合し、次世代リモコンのデザインに貢献しました。大規模なハードウェア組織の中で消費者向けデザイン思考を拡張する方法を学んだ期間でした。' },
      { sel: '.timeline-item:nth-child(2) .tag:nth-child(1)', jp: 'スマートTV' },
      { sel: '.timeline-item:nth-child(2) .tag:nth-child(2)', jp: 'マルチスクリーン' },
      { sel: '.timeline-item:nth-child(2) .tag:nth-child(3)', jp: 'ハードウェア統合' },
      { sel: '.timeline-item:nth-child(2) .tag:nth-child(4)', jp: '10フィートUI' },
      // Timeline – One Month (contract)
      { sel: '.timeline-item:nth-child(3) .timeline-period', jp: '2013 – 2014年' },
      { sel: '.timeline-item:nth-child(3) .timeline-contract-role', jp: 'デザイナー（契約） · ニューヨーク、NY' },
      { sel: '.timeline-item:nth-child(3) .timeline-contract-desc', jp: 'Y Combinator（S13）期間中にMVPデザインに貢献。技術カリキュラムをユーザーフレンドリーなワークフローに変換し、シード資金の獲得に貢献しました。' },
      // Timeline – VHX
      { sel: '.timeline-item:nth-child(4) .timeline-period', jp: '2015年10月 – 2016年5月' },
      { sel: '.timeline-item:nth-child(4) .timeline-role', jp: 'シニアプロダクトデザイナー · ブルックリン、NY' },
      { sel: '.timeline-item:nth-child(4) .timeline-desc', jp: 'VHXのD2Cビデオツールを決済フローと視聴者管理に重点を置いてデザイン — 独立系クリエイターが独自のストリーミングチャンネルを構築するためのインフラを提供。VHXがVimeoに買収された際、Vimeoプラットフォーム全体で採用されたOTTアプリの基盤パターンを確立しました。' },
      { sel: '.timeline-item:nth-child(4) .tag:nth-child(1)', jp: 'D2C動画' },
      { sel: '.timeline-item:nth-child(4) .tag:nth-child(2)', jp: '決済フロー' },
      { sel: '.timeline-item:nth-child(4) .tag:nth-child(3)', jp: 'クリエイターツール' },
      { sel: '.timeline-item:nth-child(4) .tag:nth-child(4)', jp: 'Vimeoに買収' },
      // Timeline – Vimeo
      { sel: '.timeline-item:nth-child(6) .timeline-period', jp: '2016年6月 – 2025年6月' },
      { sel: '.timeline-item:nth-child(6) .timeline-role', jp: 'シニアプロダクトデザイナー · ニューヨーク、NY' },
      { sel: '.timeline-item:nth-child(6) .timeline-desc', jp: 'Vimeoで約10年間、VHX買収後の統合から始まりました。Vimeo Streamingのクロスプラットフォーム配信（Web、モバイル、TVアプリ）のエンドツーエンドデザインを設計し、毎日数百万回の再生を支えるVimeoプレーヤーのインタラクションパターンを形作りました。クリエイターツールからB2Bプラットフォームへの進化を通じて、Webとモバイルの共有デザインシステムを維持し続けました。' },
      { sel: '.timeline-item:nth-child(6) .tag:nth-child(1)', jp: 'OTTプラットフォーム' },
      { sel: '.timeline-item:nth-child(6) .tag:nth-child(2)', jp: 'クロスプラットフォーム' },
      { sel: '.timeline-item:nth-child(6) .tag:nth-child(3)', jp: 'デザインシステム' },
      { sel: '.timeline-item:nth-child(6) .tag:nth-child(4)', jp: '動画プレーヤーUX' },
      { sel: '.timeline-item:nth-child(6) .tag:nth-child(5)', jp: '買収後統合' },
      // Timeline – Recount Media (contract) — COMMENTED OUT from timeline
      // { sel: '.timeline-item:nth-child(6) .timeline-period', jp: '2020年' },
      // { sel: '.timeline-item:nth-child(6) .timeline-contract-role', jp: 'シニアプロダクトデザイナー（契約） · ニューヨーク、NY' },
      // { sel: '.timeline-item:nth-child(6) .timeline-contract-desc', jp: '政治ニュースプラットフォーム向けにモバイルファーストの動画ディスカバリー機能をデザイン。編集チームとエンジニアリングチームとの迅速なプロトタイピングを通じて視聴者リテンションを最適化しました。' },
      // Timeline – primitives.xyz (contract) — COMMENTED OUT from timeline
      // { sel: '.timeline-item:nth-child(7) .timeline-period', jp: '2022 – 2024年' },
      // { sel: '.timeline-item:nth-child(7) .timeline-contract-role', jp: 'シニアプロダクトデザイナー（契約） · ニューヨーク、NY' },
      // { sel: '.timeline-item:nth-child(7) .timeline-contract-desc', jp: '分散型ソーシャル共有プロトコルを軸にiOSとモバイルWeb向けのクリエイターアプリを構築。Web3のコンセプトをオンボーディングとコンテンツ作成のためのアクセスしやすいモバイルインターフェースに変換しました。' },
      // Timeline – Looking Glass (contract)
      { sel: '.timeline-item:nth-child(5) .timeline-period', jp: '2022 – 2024年' },
      { sel: '.timeline-item:nth-child(5) .timeline-contract-role', jp: 'シニアプロダクトデザイナー（契約） · ブルックリン、NY' },
      { sel: '.timeline-item:nth-child(5) .timeline-contract-desc', jp: 'ホログラフィックディスプレイ向けのインタラクションモデルと、2Dデスクトップワークフローと3D空間ビジュアライゼーションを橋渡しするデザインシステムを開発。グラフィックスエンジニアと連携してUnityベースのアプリケーションに取り組みました。' },
      // Timeline – Next chapter
      { sel: '.timeline-item:nth-child(7) .timeline-period', jp: '次の章' },
      { sel: '.timeline-item:nth-child(7) .timeline-role', jp: 'きっと面白い何か' },
      { sel: '.timeline-item:nth-child(7) .timeline-desc', jp: '新しい分野の難しい問題に最もやりがいを感じます。まだデザインの教科書がないもの — プラットフォーム、プロダクト、存在しないはずのもの — を作っているなら、一緒に作りたいと思う可能性は十分にあります。' },
      { sel: '.timeline-item:nth-child(7) .tag:nth-child(1)', jp: '現在空き' },
      { sel: '.timeline-item:nth-child(7) .tag:nth-child(2)', jp: '良い出会いを待っています' },
      // Download resume
      { sel: '.contact-label', jp: '履歴書をダウンロード', all: true },
      // Contact section
      { sel: '#contact h2', jp: '話しましょう。' },
      { sel: '.contact-sub', jp: '新しい分野の難しい問題に最もやりがいを感じます — 特に、自分を成長させてくれるデザイナーたちと一緒に。動画や新技術の分野で野心的なものを作っているなら、ぜひお話ししましょう。' },
      // Footer
      { sel: 'footer span:first-child', html: '<span class="hide-mobile">ドン・ポリスティコ · </span>プロダクトデザイナー · ブルックリン、NY · <a href="mailto:don@polisti.co">don@polisti.co</a>' },
      { sel: 'footer span:last-child', jp: 'BFA, MICA · AI for UX Design Cert. 2025' },
    ];

    // store originals on first run
    let originals = null;
    function storeOriginals() {
      originals = jpMap.map(entry => {
        const el = document.querySelector(entry.sel);
        if (!el) return null;
        return entry.html ? el.innerHTML : el.textContent;
      });
    }

    function toggleJapanese() {
      const avatar = document.getElementById('navAvatar');
      if (!isJapanese) {
        // Switch to Japanese
        if (!originals) storeOriginals();
        avatar.src = 'images/avatar-taiko.gif';
        document.documentElement.lang = 'ja';
        jpMap.forEach(entry => {
          const el = document.querySelector(entry.sel);
          if (!el) return;
          if (entry.html) { el.innerHTML = entry.html; }
          else { el.textContent = entry.jp; }
        });
        // also translate the nav name
        const navName = document.querySelector('.nav-logo a[href="#"]');
        if (navName) { navName._origText = navName.textContent; navName.textContent = 'ドン・ポリスティコ'; }
        // swap Instagram link
        const igLink = document.querySelector('.contact-link[href*="instagram.com/donosaur"]');
        if (igLink) { igLink._origHref = igLink.href; igLink.href = 'https://www.instagram.com/donosaur.taiko'; igLink.querySelector('.contact-label').textContent = '@donosaur.taiko'; }
        isJapanese = true;
        window.isJapanese = true;
        if (window.updateHeroHeadline) window.updateHeroHeadline();
      } else {
        // Switch back to English
        avatar.src = 'images/avatar.gif';
        document.documentElement.lang = 'en';
        jpMap.forEach((entry, i) => {
          const el = document.querySelector(entry.sel);
          if (!el || originals[i] === null) return;
          if (entry.html) { el.innerHTML = originals[i]; }
          else { el.textContent = originals[i]; }
        });
        const navName = document.querySelector('.nav-logo a[href="#"]');
        if (navName && navName._origText) { navName.textContent = navName._origText; }
        // restore Instagram link
        const igLink = document.querySelector('.contact-link[href*="instagram.com/donosaur"]');
        if (igLink && igLink._origHref) { igLink.href = igLink._origHref; igLink.querySelector('.contact-label').textContent = '@donosaur'; }
        isJapanese = false;
        window.isJapanese = false;
        if (window.updateHeroHeadline) window.updateHeroHeadline();
      }
    }

    // ── Interactive Tag Jumping ──
    function highlightCard(cardId) {
      if (document.body.style.overflow === 'hidden') {
        closeMobileMenu(); // close mobile menu if open
      }

      const card = document.getElementById(cardId);
      if (!card) return;

      // smooth scroll to the work section, slightly offset to show the section header
      const workSection = document.getElementById('work');
      const yOffset = -40;
      const y = workSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // trigger a vivid highlight flash (using CSS class)
      // first, remove it from all in case they click fast
      document.querySelectorAll('.work-card.tag-highlight').forEach(el => el.classList.remove('tag-highlight'));

      // force reflow
      void card.offsetWidth;

      // add the highlight class
      card.classList.add('tag-highlight');

      // remove it after animation
      setTimeout(() => {
        card.classList.remove('tag-highlight');
      }, 2500);
    }

    // ── Hero video fallback is now handled by the YouTube IFrame Player API ──
    // See the inline script in the hero section for the full fallback chain:
    // YouTube embed → self-hosted MP4 → static fallback image

    // let entry animations finish before cursor takes over
    setTimeout(tick, 1400);

    // ── Konami code → Playground unlock ──────────────────────────────
    /*
    (function () {
      const CODE = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
      const PLAYGROUND_URL = 'http://localhost:3000'; // update when deployed separately
      const STORAGE_KEY = 'don_playground_unlocked';
      let pos = 0;

      document.addEventListener('keydown', function (e) {
        const expected = CODE[pos];
        const key = e.key;
        if (key === expected) {
          pos++;
          if (pos === CODE.length) {
            pos = 0;
            unlock();
          }
        } else {
          // reset — but allow restarting from current key if it matches index 0
          pos = (key === CODE[0]) ? 1 : 0;
        }
      });

      function unlock() {
        localStorage.setItem(STORAGE_KEY, '1');

        // Build overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = [
          'position:fixed', 'inset:0', 'z-index:99999',
          'background:#0d0d0d',
          'display:flex', 'flex-direction:column',
          'align-items:center', 'justify-content:center',
          'opacity:0', 'transition:opacity 0.4s ease',
          'font-family:"Lexend Deca",sans-serif',
          'cursor:crosshair',
        ].join(';');

        overlay.innerHTML = `
          <style>
            @keyframes don-shimmer {
              0%   { background-position: -200% center; }
              100% { background-position:  200% center; }
            }
            .don-unlock-label {
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.3);
              margin-bottom: 20px;
            }
            .don-unlock-heading {
              font-size: clamp(36px, 6vw, 64px);
              font-style: italic;
              font-weight: 600;
              background: linear-gradient(90deg,#D8983E 0%,#f5d98a 40%,#D8983E 60%,#c07a1a 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: don-shimmer 2s linear infinite;
            }
          </style>
          <p class="don-unlock-label">unlocked</p>
          <h1 class="don-unlock-heading">the playground.</h1>
        \`;

        document.body.appendChild(overlay);

        // Fade in overlay, then navigate
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            overlay.style.opacity = '1';
            setTimeout(function () {
              window.location.href = PLAYGROUND_URL;
            }, 1200);
          });
        });
      }
    })();
    */

    document.addEventListener('DOMContentLoaded', function() {
      const cta = document.querySelector('.hero-cta');
      if (!cta) return;

      let rafId = null;

      cta.addEventListener('mousemove', function(e) {
        // Skip heavy transformation on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          const rect = cta.getBoundingClientRect();
          const x = e.clientX - rect.left; 
          const y = e.clientY - rect.top; 
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const deltaX = x - centerX;
          const deltaY = y - centerY;
          
          const rotateX = (deltaY / centerY) * -7.5; 
          const rotateY = (deltaX / centerX) * 7.5;
          
          const translateX = deltaX * 0.125;
          const translateY = deltaY * 0.125;

          cta.style.transform = 'perspective(1000px) translate3d(' + translateX + 'px, ' + translateY + 'px, 0) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
          cta.style.transition = 'transform 0.1s ease-out';
        });
      });

      cta.addEventListener('mouseleave', function() {
        if (rafId) cancelAnimationFrame(rafId);
        requestAnimationFrame(() => {
          cta.style.transform = 'perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
          cta.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
        });
      });
    });

    // ── Local WYSIWYG Editor Injection ──────────────────────────────
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'css/local-editor.css';
      document.head.appendChild(cssLink);

      const jsScript = document.createElement('script');
      jsScript.src = 'js/local-editor.js';
      document.body.appendChild(jsScript);
    }
