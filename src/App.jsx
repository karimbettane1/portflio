import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useSpring, useInView, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  FiArrowUpRight, FiDownload, FiMail, FiGithub, FiLinkedin, FiInstagram,
  FiChevronDown, FiArrowUp, FiCode, FiDatabase, FiServer, FiCpu,
  FiSend, FiCheck, FiExternalLink, FiZap, FiLayers, FiGrid, FiMapPin,
  FiBook, FiGlobe, FiUser, FiHeart
} from "react-icons/fi";
import {
  SiReact, SiLaravel, SiJavascript, SiPhp, SiMysql, SiBootstrap,
  SiGit, SiTailwindcss, SiNodedotjs, SiTypescript, SiFigma, SiVuedotjs
} from "react-icons/si";
import { FaFacebookF, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import Typed from "typed.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  accent: "#06B6D4",
  bg: "#0F172A",
  text: "#F8FAFC",
};

function useAnimatedNumber(end, inView, duration=1.55){
  const [n,setN] = useState(0);
  useEffect(()=>{
    if(!inView) return;
    let raf=0;
    const s=performance.now();
    const step=(t)=>{
      const p=Math.min((t-s)/(duration*1000),1);
      const e=1-Math.pow(1-p,3);
      setN(Math.floor(end*e));
      if(p<1) raf=requestAnimationFrame(step);
    };
    raf=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(raf);
  },[end,inView,duration]);
  return n;
}

const MouseFollower = ()=>{
  const [pos,setPos]=useState({x:-120,y:-120});
  const [hover,setHover]=useState(false);
  useEffect(()=>{
    const move=(e)=>setPos({x:e.clientX,y:e.clientY});
    window.addEventListener("mousemove",move);
    const enter=()=>setHover(true), leave=()=>setHover(false);
    const bind=()=>document.querySelectorAll("a,button,.hover-target").forEach(el=>{
      el.addEventListener("mouseenter",enter); el.addEventListener("mouseleave",leave);
    });
    bind();
    const id=setInterval(bind,1200);
    return()=>{window.removeEventListener("mousemove",move); clearInterval(id);}
  },[]);
  return(
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:block mix-blend-difference"
        animate={{ x:pos.x-9, y:pos.y-9, scale: hover?1.65:1 }}
        transition={{ type:"spring", damping:24, stiffness:420, mass:.32 }}
      ><div className="w-[18px] h-[18px] rounded-full bg-white"/></motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden lg:block"
        animate={{ x:pos.x-20, y:pos.y-20 }}
        transition={{ type:"spring", damping:31, stiffness:145, mass:.82 }}
      >
        <div className="w-[40px] h-[40px] rounded-full border border-[#3b82f645]" style={{boxShadow:"0 0 28px rgba(90,124,255,.16)", background:"radial-gradient(circle, rgba(139,92,246,.07), transparent 70%)"}}/>
      </motion.div>
    </>
  );
};

const ScrollProgressBar=()=>{
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:120, damping:32 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[130]" style={{ scaleX, background:"linear-gradient(90deg,#06B6D4,#3B82F6 30%,#8B5CF6)", boxShadow:"0 0 20px rgba(59,130,246,.42)" }} />;
};

const ParticleCanvas=()=>{
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); if(!ctx) return;
    let w= c.width = c.offsetWidth, h= c.height=c.offsetHeight;
    const onR=()=>{ w=c.width=c.offsetWidth; h=c.height=c.offsetHeight };
    window.addEventListener("resize",onR);
    const dots=Array.from({length:58}).map(()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.33, vy:(Math.random()-.5)*.33, r:Math.random()*1.4+.35
    }));
    let raf=0;
    const loop=()=>{
      ctx.clearRect(0,0,w,h);
      dots.forEach((p,i)=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(176,202,255,.50)"; ctx.fill();
        for(let j=i+1;j<dots.length;j++){
          const q=dots[j];
          const dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
          if(d<138){
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
            ctx.strokeStyle=`rgba(105,144,235,${0.14*(1-d/138)})`;
            ctx.lineWidth=.55; ctx.stroke();
          }
        }
      });
      raf=requestAnimationFrame(loop);
    };
    loop();
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onR); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-85" />;
};

const navItems=[
  {id:"home",label:"Accueil"},
  {id:"skills",label:"Compétences"},
  {id:"projects",label:"Projets"},
  {id:"experience",label:"Parcours"},
  {id:"services",label:"Services"},
  {id:"contact",label:"Contact"},
];

const downloadCV = () => {
  const cvContent = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>CV - Karim BETTANE</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f7fa;color:#1a202c;line-height:1.6}.cv-container{max-width:800px;margin:40px auto;background:white;box-shadow:0 4px 20px rgba(0,0,0,0.12)}.header{background:linear-gradient(135deg,#3B82F6 0%,#8B5CF6 100%);color:white;padding:40px}.header h1{font-size:36px;font-weight:700;letter-spacing:2px;margin-bottom:8px}.header p{font-size:14px;opacity:0.95;letter-spacing:3px;text-transform:uppercase}.content{padding:40px}.section{margin-bottom:32px}.section-title{font-size:16px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:20px}.contact-item{display:flex;align-items:center;gap:10px;font-size:14px}.contact-icon{width:32px;height:32px;background:#ebf5ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#3B82F6}.profile-text{font-size:14px;color:#4a5568;text-align:justify}.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}.skill-category h4{font-size:14px;font-weight:600;color:#2d3748;margin-bottom:10px}.skill-category ul{list-style:none}.skill-category li{font-size:13px;color:#4a5568;padding:4px 0;padding-left:16px;position:relative}.skill-category li::before{content:"•";color:#3B82F6;font-weight:bold;position:absolute;left:0}.education-item,.lang-item{margin-bottom:16px}.education-item h4,.lang-item h4{font-size:14px;font-weight:600;color:#2d3748}.education-item p,.lang-item p{font-size:13px;color:#718096}.lang-bar{height:6px;background:#e2e8f0;border-radius:3px;margin-top:6px;overflow:hidden}.lang-fill{height:100%;background:linear-gradient(90deg,#3B82F6,#8B5CF6);border-radius:3px}.qualities-grid,.interests-grid{display:flex;flex-wrap:wrap;gap:8px}.quality-tag,.interest-tag{padding:6px 14px;background:#ebf5ff;color:#3B82F6;border-radius:20px;font-size:12px;font-weight:500}.interest-tag{background:#f3e8ff;color:#8B5CF6}.print-btn{position:fixed;bottom:30px;right:30px;padding:14px 28px;background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(59,130,246,0.4)}.@media print{.print-btn{display:none}body{background:white}.cv-container{box-shadow:none;margin:0}}</style></head>
<body><button class="print-btn" onclick="window.print()">📄 Télécharger / Imprimer</button>
<div class="cv-container"><div class="header"><h1>KARIM BETTANE</h1><p>Développeur Web Full Stack</p></div>
<div class="content"><div class="section"><h2 class="section-title">📞 Contact</h2><div class="contact-grid"><div class="contact-item"><div class="contact-icon">📱</div><span>+212 687 238 961</span></div><div class="contact-item"><div class="contact-icon">✉️</div><span>karimbettane94@gmail.com</span></div><div class="contact-item"><div class="contact-icon">📍</div><span>Sefrou - Maroc</span></div></div></div>
<div class="section"><h2 class="section-title">👤 Profil</h2><p class="profile-text">Stagiaire à l'OFPPT en Développement Digital, option Développeur Web Full Stack (2024-2026). Passionné par le web, je développe des compétences en création d'applications front-end et back-end, avec un intérêt pour les technologies modernes et les projets pratiques.</p></div>
<div class="section"><h2 class="section-title">🎓 Formation</h2><div class="education-item"><h4>Diplôme en Développement Digital</h4><p>ISTA SEFROU | 2024 - 2026</p></div><div class="education-item"><h4>Baccalauréat</h4><p>Lycée Qualifiant Badr | 2023</p></div></div>
<div class="section"><h2 class="section-title">🛠 Compétences Techniques</h2><div class="skills-grid"><div class="skill-category"><h4>Front-end</h4><ul><li>HTML5, CSS3</li><li>JavaScript</li><li>React</li><li>Bootstrap</li></ul></div><div class="skill-category"><h4>Back-end</h4><ul><li>PHP</li><li>Laravel</li><li>MySQL</li><li>MongoDB</li></ul></div><div class="skill-category"><h4>Outils & Méthodologies</h4><ul><li>Git, GitLab, GitHub</li><li>Agile Scrum</li><li>VS Code</li></ul></div><div class="skill-category"><h4>Informatique</h4><ul><li>Bases de données</li><li>Algorithmique</li><li>Structures de données</li><li>Analyse & résolution</li></ul></div></div></div>
<div class="section"><h2 class="section-title">🌍 Langues</h2><div class="lang-item"><h4>Arabe <span style="float:right;font-weight:normal;">Langue maternelle</span></h4><div class="lang-bar"><div class="lang-fill" style="width:100%"></div></div></div><div class="lang-item"><h4>Français <span style="float:right;font-weight:normal;">Intermédiaire</span></h4><div class="lang-bar"><div class="lang-fill" style="width:70%"></div></div></div><div class="lang-item"><h4>Anglais <span style="float:right;font-weight:normal;">Intermédiaire</span></h4><div class="lang-bar"><div class="lang-fill" style="width:65%"></div></div></div></div>
<div class="section"><h2 class="section-title">💪 Qualités Personnelles</h2><div class="qualities-grid"><span class="quality-tag">Sens de la responsabilité</span><span class="quality-tag">Esprit d'équipe</span><span class="quality-tag">Capacité d'apprentissage rapide</span><span class="quality-tag">Organisation</span><span class="quality-tag">Gestion du temps</span><span class="quality-tag">Sens de la communication</span></div></div>
<div class="section"><h2 class="section-title">❤️ Centres d'Intérêt</h2><div class="interests-grid"><span class="interest-tag">🎯 Développement personnel</span><span class="interest-tag">💻 Coding / Programmation</span><span class="interest-tag">🎵 Musique</span><span class="interest-tag">🚀 Nouvelles technologies</span></div></div></div></div></body></html>`;
  const blob = new Blob([cvContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cv-karim-bettane.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Navbar=()=>{
  const [sc,setSc]=useState(false);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState("home");
  useEffect(()=>{
    const fn=()=>{
      setSc(window.scrollY>24);
      const ids=navItems.map(n=>n.id);
      for(let i=ids.length-1;i>=0;i--){
        const el=document.getElementById(ids[i]);
        if(el && window.scrollY >= el.offsetTop-170){ setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll",fn,{passive:true}); fn();
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  const go=(id)=>{ document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  return(
    <motion.nav
      initial={{y:-26,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.5}}
      className={`fixed top-0 inset-x-0 z-[100] transition-all ${sc ? "py-[13px] backdrop-blur-[20px]":"py-[25px]"}`}
      style={{
        background: sc ? "linear-gradient(180deg, rgba(10,17,36,.88), rgba(10,17,36,.60))" : "transparent",
        borderBottom: sc ? "1px solid rgba(255,255,255,.067)" : "1px solid transparent"
      }}
    >
      <div className="max-w-[1190px] mx-auto px-5 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>go("home")}>
          <div className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center text-white font-[800] text-[17.5px] font-[Poppins]"
            style={{background:"linear-gradient(135deg,#4a7bf7,#945ff0 60%, #2ad9ef 116%)", boxShadow:"0 8px 28px rgba(72,118,255,.28)"}}>KB</div>
          <div className="hidden sm:block">
            <div className="font-[Poppins] font-[700] text-[15.7px] text-[#f4f8ff] leading-tight tracking-[-0.012em]">Karim Bettane</div>
            <div className="text-[11px] text-[#9db4d6]">Full Stack Developer</div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-[30px]">
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>go(n.id)}
              className={`text-[13.7px] relative pb-1 font-[500] transition ${active===n.id? "text-[#eaf2ff]" : "text-[#9bb0cf] hover:text-[#d9e7ff]"}`}
            >
              {n.label}
              {active===n.id && <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-[4px] h-[2px] rounded-full" style={{background:"linear-gradient(90deg,#3B82F6,#8B5CF6)"}}/>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>go("contact")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-[10px] rounded-full text-white text-[13.5px] font-[620] hover-target"
            style={{background:"linear-gradient(100deg,#3b79f5,#885ae8 88%)", boxShadow:"0 8px 26px rgba(94,106,255,.26)"}}
          >Me Recruter <FiArrowUpRight/></button>
          <button className="lg:hidden w-[41px] h-[41px] rounded-[12px] border border-white/[0.12] bg-white/[0.028] flex flex-col items-center justify-center gap-[5px]" onClick={()=>setOpen(o=>!o)} aria-label="menu">
            <span className={`w-[17px] h-[2px] bg-[#e7f0ff] rounded transition-all ${open?"rotate-45 translate-y-[7px]":""}`}/>
            <span className={`w-[17px] h-[2px] bg-[#e7f0ff] rounded transition-all ${open?"opacity-0":""}`}/>
            <span className={`w-[17px] h-[2px] bg-[#e7f0ff] rounded transition-all ${open?"-rotate-45 -translate-y-[7px]":""}`}/>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,y:-9}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-9}}
            className="lg:hidden mx-4 mt-3 rounded-[20px] border border-white/[0.09] px-5 py-[16px]"
            style={{background:"rgba(14,24,48,.95)", backdropFilter:"blur(18px)"}}
          >
            <div className="grid grid-cols-2 gap-y-[15px]">
              {navItems.map(n=><button key={n.id} onClick={()=>go(n.id)} className="text-left text-[14px] text-[#c6d8ef]">{n.label}</button>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const HeroStat = ({ n, suf, label })=>{
  const ref = useRef(null);
  const inView = useInView(ref,{once:true, margin:"-60px"});
  const val = useAnimatedNumber(n, inView);
  return (
    <div ref={ref} className="rounded-[22px] border border-white/[0.082] text-center py-[22px] px-4"
      style={{background:"linear-gradient(180deg, rgba(255,255,255,.047), rgba(255,255,255,.019))", boxShadow:"inset 0 1px 0 rgba(255,255,255,.065)"}}
    >
      <div className="font-[Poppins] font-[800] text-[33px] text-white leading-none">{val}{suf}</div>
      <div className="text-[11.7px] text-[#9fb9dc] mt-[7px] leading-[1.35] font-[600] whitespace-pre-line">{label}</div>
    </div>
  );
};

const Hero=()=>{
  const typedEl=useRef(null);
  const heroRef=useRef(null);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const fx=useTransform(mx,[-120,120],[-14,14]);
  const fy=useTransform(my,[-120,120],[-12,12]);

  useEffect(()=>{
    if(!typedEl.current) return;
    const t=new Typed(typedEl.current,{
      strings:["Full Stack Developer","React Developer","Laravel Developer","UI/UX Enthusiast","Software Engineer"],
      typeSpeed:54, backSpeed:33, backDelay:1650, loop:true
    });
    return()=>t.destroy();
  },[]);

  useEffect(()=>{
    const move=(e)=>{
      if(!heroRef.current) return;
      const r=heroRef.current.getBoundingClientRect();
      mx.set(e.clientX - (r.left + r.width/2));
      my.set(e.clientY - (r.top + r.height/2));
    };
    window.addEventListener("mousemove",move);
    return()=>window.removeEventListener("mousemove",move);
  },[mx,my]);

  const stats = useMemo(()=>[
    { n:4, suf:"+", label:"Projets\nRéalisés" },
    { n:2, suf:"+", label:"Années\nFormation" },
    { n:10,suf:"+", label:"Technologies\nMaîtrisées" },
    { n:100,suf:"%",label:"Disponible\nImmédiatement"},
  ],[]);

  return(
    <section id="home" ref={heroRef} className="relative min-h-[104vh] flex items-center overflow-hidden">
      <div className="absolute inset-0"
        style={{background:"radial-gradient(circle at 15% 18%, rgba(59,130,246,.143) 0%,transparent 47%), radial-gradient(circle at 82% 21%, rgba(139,92,246,.13) 0%,transparent 45%), radial-gradient(circle at 62% 72%, rgba(6,182,212,.092) 0%,transparent 42%), #0F172A"}}
      />
      <ParticleCanvas/>
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.15] pointer-events-none" style={{background:"linear-gradient(120deg,#3B82F6,#8B5CF6,#06B6D4)"}}/>
      <div className="absolute -bottom-14 -left-24 w-[440px] h-[440px] rounded-full blur-[118px] opacity-[0.125] pointer-events-none" style={{background:"linear-gradient(120deg,#8B5CF6,#06B6D4)"}}/>

      <div className="relative z-10 w-full max-w-[1196px] mx-auto px-5 lg:px-8 pt-[118px] pb-[92px]">
        <div className="grid lg:grid-cols-[1.15fr_.9fr] gap-10 items-center">
          <div>
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.5}}
              className="inline-flex items-center gap-2 px-[14px] py-[7px] rounded-full text-[12.4px] font-[620] text-[#bfe9ff] mb-6 border border-[#3b82f640]"
              style={{background:"rgba(27,45,92,.47)", boxShadow:"inset 0 1px 0 rgba(255,255,255,.05), 0 0 28px rgba(59,130,246,.11)"}}
            >
              <span className="w-[7px] h-[7px] rounded-full bg-[#35e29d] animate-pulse"/>
              Disponible pour freelance
              <span className="px-[7px] py-[2px] rounded-full bg-white/[0.068] text-[10.2px] text-[#8ad6ff]">OUVERT</span>
            </motion.div>

            <motion.h1
              initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:.16,duration:.62}}
              className="font-[Poppins] tracking-[-0.034em] leading-[0.92] mb-4 text-[#f6faff]"
              style={{fontSize:"clamp(50px,7.4vw,94px)", fontWeight:900}}
            >
              KARIM<br/>
              <span style={{background:"linear-gradient(95deg,#57c8ff 2%, #779aff 28%, #a46fff 58%, #d58aff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>BETTANE</span>
            </motion.h1>

            <div className="text-[21px] lg:text-[27px] text-[#d7e7ff] font-[500] h-[36px] mb-6">
              <span ref={typedEl} />
              <span className="text-[#7aa6ff]">|</span>
            </div>

            <p className="text-[16.15px] leading-[1.73] text-[#b7c9e4] max-w-[586px] mb-[30px]">
              Création d'expériences digitales exceptionnelles avec les technologies modernes. Spécialisé en React, Laravel et solutions full-stack scalables avec un design pixel-perfect.
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <button onClick={downloadCV}
                 className="inline-flex items-center gap-[9px] px-[23px] py-[14px] rounded-[15px] text-white text-[14.4px] font-[650] hover-target"
                 style={{background:"linear-gradient(100deg,#3c7cf7,#8654ef)", boxShadow:"0 13px 34px rgba(84,91,255,.33), inset 0 1px 0 rgba(255,255,255,.18)"}}
              ><FiDownload/> Télécharger CV</button>
              <a href="#contact" onClick={e=>{e.preventDefault(); document.getElementById("contact")?.scrollIntoView({behavior:"smooth"});}}
                 className="px-[22px] py-[14px] rounded-[15px] text-[14.4px] font-[630] text-[#e6f0ff] border border-white/[0.16] bg-white/[0.034] hover:bg-white/[0.058] transition flex items-center gap-2"
              >Me Contacter <FiArrowUpRight/></a>
            </div>

            <div className="flex flex-wrap gap-[10px]">
              {[
                {Icon:SiReact, label:"React", color:"#5dd4f9"},
                {Icon:SiLaravel, label:"Laravel", color:"#ff5b4a"},
                {Icon:SiTypescript, label:"TypeScript", color:"#4a9dff"},
                {Icon:SiNodedotjs, label:"Node", color:"#5ed272"},
              ].map(s=>(
                <div key={s.label} className="flex items-center gap-2 px-[13px] py-[8px] rounded-[13px] bg-white/[0.026] border border-white/[0.082] text-[12.7px] text-[#cad9ef] font-[600]">
                  <s.Icon style={{color:s.color}} className="text-[16px]" /> {s.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <motion.div style={{x:fx,y:fy}} className="relative">
              <div className="absolute inset-0 -m-9 rounded-full blur-[68px] opacity-[0.69]"
                style={{background:"conic-gradient(from 130deg,#3B82F6,#8B5CF6,#06B6D4,#3B82F6)"}}/>
              <div className="relative w-[330px] sm:w-[400px] md:w-[430px] h-[330px] sm:h-[400px] md:h-[430px] rounded-[38px] border border-white/[0.105]"
                style={{background:"linear-gradient(145deg, rgba(255,255,255,.065), rgba(255,255,255,.023))", boxShadow:"0 34px 78px rgba(6,12,32,.59), inset 0 1px 0 rgba(255,255,255,.11)", backdropFilter:"blur(18px)"}}
              >
                <div className="absolute inset-[19px] rounded-[28px] overflow-hidden">
                  <img src="/images/image.png" alt="Karim Bettane" className="w-full h-full object-cover"
                    onError={e=>{e.currentTarget.style.display="none"; const f=document.getElementById("kb-fallback"); if(f) f.style.display="flex";}}
                  />
                  <div id="kb-fallback" className="w-full h-full hidden items-center justify-center bg-[#16284a] text-[#92baff] text-[42px] font-[800] font-[Poppins]">KB</div>
                  <div className="absolute inset-0" style={{background:"linear-gradient(180deg, transparent 46%, rgba(11,18,38,.24) 100%)"}}/>
                </div>

                <motion.div animate={{y:[0,-9,0]}} transition={{duration:3.1,repeat:Infinity,ease:"easeInOut"}}
                  className="absolute -left-7 top-[50px] px-3.5 py-[9px] rounded-[17px] text-[12.3px] font-[650] text-[#dcf4ff] flex items-center gap-2"
                  style={{background:"rgba(19,34,66,.86)", border:"1px solid rgba(255,255,255,.12)", backdropFilter:"blur(9px)", boxShadow:"0 12px 30px rgba(0,0,0,.29)"}}
                ><SiReact className="text-[#52d7ff] text-[16px]"/> Expert React</motion.div>

                <motion.div animate={{y:[0,11,0]}} transition={{duration:3.5,repeat:Infinity,ease:"easeInOut",delay:.6}}
                  className="absolute -right-6 top-[46%] px-3.5 py-[9px] rounded-[17px] text-[12.3px] font-[650] text-[#ffe9e7] flex items-center gap-2"
                  style={{background:"rgba(19,34,66,.86)", border:"1px solid rgba(255,255,255,.12)", backdropFilter:"blur(9px)", boxShadow:"0 12px 30px rgba(0,0,0,.29)"}}
                ><SiLaravel className="text-[#ff6a55] text-[16px]"/> Pro Laravel</motion.div>

                <motion.div animate={{y:[0,-8,0]}} transition={{duration:3.25,repeat:Infinity,ease:"easeInOut",delay:1}}
                  className="absolute left-[26%] -bottom-3 px-3.5 py-[9px] rounded-[17px] text-[12.3px] font-[650] text-[#d8f8ff] flex items-center gap-2"
                  style={{background:"rgba(19,34,66,.86)", border:"1px solid rgba(255,255,255,.12)", backdropFilter:"blur(9px)", boxShadow:"0 12px 30px rgba(0,0,0,.29)"}}
                ><FiZap className="text-[#3adfff]"/> Full Stack</motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-[58px]">
          {stats.map(s=><HeroStat key={s.label} n={s.n} suf={s.suf} label={s.label}/>)}
        </div>
      </div>

      <button onClick={()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"})}
        className="absolute left-1/2 -translate-x-1/2 bottom-6 text-[#8eaddd] text-[11.5px] tracking-wider flex flex-col items-center gap-2"
      >
        Scroll
        <motion.div animate={{y:[0,6,0]}} transition={{repeat:Infinity,duration:1.55}}><FiChevronDown className="text-[18px]"/></motion.div>
      </button>
    </section>
  );
};

const SectionEyebrow = ({text})=>(
  <div className="inline-flex items-center gap-2 text-[11.5px] font-[700] text-[#6fd8ff] tracking-[.14em] uppercase mb-[10px]">
    <span className="w-[28px] h-[1.6px] rounded-full" style={{background:"linear-gradient(90deg,#06B6D4,#3B82F6)"}}/>
    {text}
  </div>
);

const About = ()=>{
  const cards=[
    {icon:<FiCode/>, title:"Développement Front-end", desc:"HTML, CSS, JavaScript, React, Bootstrap - interfaces réactives et modernes.", color:"#3B82F6"},
    {icon:<FiServer/>, title:"Développement Back-end", desc:"PHP, Laravel, MySQL, MongoDB - APIs REST robustes et sécurisées.", color:"#8B5CF6"},
    {icon:<FiDatabase/>, title:"Base de Données", desc:"Conception et gestion MySQL, MongoDB, optimisation des requêtes.", color:"#06B6D4"},
    {icon:<FiCpu/>, title:"Outils & Méthodes", desc:"Git, GitLab, GitHub, Agile Scrum - développement collaboratif.", color:"#22c55e"},
  ];
  return(
    <section id="about" className="py-[106px] relative">
      <div className="max-w-[1196px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
          <div>
            <SectionEyebrow text="Profil"/>
            <h2 className="text-[38px] lg:text-[48px] font-[800] text-[#f2f7ff] leading-[1.08] tracking-[-0.025em] font-[Poppins] mb-5">
              Karim<br/>BETTANE
            </h2>
            <p className="text-[15.5px] text-[#aecdff] leading-[1.82] max-w-[560px]">
              Stagiaire à l'OFPPT en Développement Digital, option Développeur Web Full Stack (2024-2026). Passionné par le web, je développe des compétences en création d'applications front-end et back-end, avec un intérêt pour les technologies modernes et les projets pratiques.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="px-4 py-2 rounded-full bg-white/[0.045] border border-white/[0.085] text-[12.5px] text-[#b8d4f5]">Développement Web</div>
              <div className="px-4 py-2 rounded-full bg-white/[0.045] border border-white/[0.085] text-[12.5px] text-[#b8d4f5]">React & Laravel</div>
              <div className="px-4 py-2 rounded-full bg-white/[0.045] border border-white/[0.085] text-[12.5px] text-[#b8d4f5]">Agile Scrum</div>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#projects" onClick={e=>{e.preventDefault(); document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}}
                 className="px-[20px] py-[12.5px] rounded-[13px] text-white text-[13.7px] font-[670]"
                 style={{background:"linear-gradient(100deg,#3d7efe,#7a58ef)", boxShadow:"0 10px 28px rgba(85,104,255,.28)"}}
              >Voir Projets</a>
              <a href="#contact" onClick={e=>{e.preventDefault(); document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}
                 className="px-[20px] py-[12.5px] rounded-[13px] text-[13.6px] font-[630] text-[#dfeaff] border border-white/[0.15] bg-white/[0.031]"
              >Me Contacter</a>
            </div>
            <div className="flex items-center gap-6 mt-9">
              {[{v:"4+",l:"Projets Majeurs"},{v:"10+",l:"Technologies"},{v:"100%",l:"Passion"}].map((s,i)=>(
                <div key={s.l} className="flex items-center gap-6">
                  {i>0 && <div className="w-px h-10 bg-white/[0.105] mr-6" />}
                  <div>
                    <div className="text-[30px] font-[800] text-white font-[Poppins] leading-none">{s.v}</div>
                    <div className="text-[11.6px] text-[#8fb1d9] mt-1">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map((c,k)=>(
              <motion.div key={c.title}
                initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{delay:k*.07}}
                whileHover={{y:-5}}
                className="rounded-[22px] border border-white/[0.083] p-5 relative overflow-hidden"
                style={{background:"linear-gradient(180deg, rgba(255,255,255,.048), rgba(255,255,255,.017))", boxShadow:"0 16px 44px rgba(4,14,36,.28), inset 0 1px 0 rgba(255,255,255,.066)"}}
              >
                <div className="absolute -right-9 -top-9 w-[118px] h-[118px] rounded-full blur-[55px] opacity-[.31]"
                  style={{background:`radial-gradient(circle, ${c.color}aa, transparent 68%)`}}/>
                <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-white text-[21px] mb-4"
                  style={{background:`linear-gradient(135deg, ${c.color}, ${c.color}c4)`, boxShadow:`0 8px 22px ${c.color}44`}}>{c.icon}</div>
                <div className="text-[15.2px] font-[700] text-white font-[Poppins] mb-[7px]">{c.title}</div>
                <div className="text-[13.3px] text-[#a7c1e4] leading-[1.56]">{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Formation & Langues */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="rounded-[22px] border border-white/[0.085] p-6" style={{background:"linear-gradient(180deg, rgba(255,255,255,.042), rgba(255,255,255,.016))"}}>
            <h3 className="text-[18px] font-[700] text-white font-[Poppins] mb-4 flex items-center gap-2"><FiBook className="text-[#6fb8ff]"/> Formation</h3>
            <div className="space-y-4">
              <div className="relative pl-4 border-l-2 border-[#3b82f644]">
                <div className="absolute left-[-5px] top-0 w-[8px] h-[8px] rounded-full bg-[#3B82F6]"/>
                <div className="text-[14px] font-[600] text-[#e8f2ff]">Diplôme en Développement Digital</div>
                <div className="text-[12.5px] text-[#9fb8d6]">ISTA SEFROU | 2024 - 2026</div>
              </div>
              <div className="relative pl-4 border-l-2 border-[#8b5cf644]">
                <div className="absolute left-[-5px] top-0 w-[8px] h-[8px] rounded-full bg-[#8B5CF6]"/>
                <div className="text-[14px] font-[600] text-[#e8f2ff]">Baccalauréat</div>
                <div className="text-[12.5px] text-[#9fb8d6]">Lycée Qualifiant Badr | 2023</div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-white/[0.085] p-6" style={{background:"linear-gradient(180deg, rgba(255,255,255,.042), rgba(255,255,255,.016))"}}>
            <h3 className="text-[18px] font-[700] text-white font-[Poppins] mb-4 flex items-center gap-2"><FiGlobe className="text-[#6fb8ff]"/> Langues</h3>
            <div className="space-y-3">
              {[{l:"Arabe",level:"Langue maternelle",p:100},{l:"Français",level:"Intermédiaire",p:70},{l:"Anglais",level:"Intermédiaire",p:65}].map(lang=>(
                <div key={lang.l}>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-[#d5e6ff]">{lang.l}</span>
                    <span className="text-[#8fb1db] text-[12px]">{lang.level}</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-white/[0.075] overflow-hidden">
                    <motion.div initial={{width:0}} whileInView={{width:`${lang.p}%`}} viewport={{once:true}} transition={{duration:1,delay:0.2}} className="h-full rounded-full" style={{background:"linear-gradient(90deg,#3B82F6,#8B5CF6)"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Qualités & Intérêts */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-[22px] border border-white/[0.085] p-6" style={{background:"linear-gradient(180deg, rgba(255,255,255,.042), rgba(255,255,255,.016))"}}>
            <h3 className="text-[18px] font-[700] text-white font-[Poppins] mb-4 flex items-center gap-2"><FiUser className="text-[#6fb8ff]"/> Qualités Personnelles</h3>
            <div className="flex flex-wrap gap-2">
              {["Responsabilité","Esprit d'équipe","Apprentissage rapide","Organisation","Gestion du temps","Communication"].map(q=>(
                <span key={q} className="px-3 py-1.5 rounded-full text-[11.5px] bg-[#3B82F6]/15 border border-[#3B82F6]/35 text-[#b8d4f5]">{q}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-white/[0.085] p-6" style={{background:"linear-gradient(180deg, rgba(255,255,255,.042), rgba(255,255,255,.016))"}}>
            <h3 className="text-[18px] font-[700] text-white font-[Poppins] mb-4 flex items-center gap-2"><FiHeart className="text-[#6fb8ff]"/> Centres d'Intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {[{i:"Dév. personnel",icon:""},{i:"Coding",icon:""},{i:"Musique",icon:"🎵"},{i:"Nouvelles tech",icon:""}].map(x=>(
                <span key={x.i} className="px-3 py-1.5 rounded-full text-[11.5px] bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 text-[#d4c4f5] flex items-center gap-1.5">{x.icon}{x.i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillBar = ({name, level, icon})=>{
  const ref=useRef(null);
  const inView = useInView(ref,{once:true, margin:"-40px"});
  return(
    <div ref={ref}>
      <div className="flex items-center justify-between text-[13.6px] mb-[7px]">
        <span className="flex items-center gap-[8px] text-[#d5e6ff]"><span className="text-[16px]">{icon}</span>{name}</span>
        <span className="text-[#8fb1db] font-[610]">{level}%</span>
      </div>
      <div className="h-[8px] rounded-full bg-white/[0.074] overflow-hidden">
        <motion.div initial={{width:0}} animate={{width: inView? `${level}%`:0}} transition={{duration:1.18, ease:"easeOut"}}
          className="h-full rounded-full"
          style={{background:"linear-gradient(90deg,#3B82F6,#8B5CF6 72%)", boxShadow:"0 0 16px rgba(93,135,255,.38)"}}
        />
      </div>
    </div>
  );
};

const Skills = ()=>{
  const groups = [
    {title:"Front-end", icon:<FiLayers/>, items:[
      {name:"HTML5", level:92, icon:<span className="text-[#f35b2a]">◈</span>},
      {name:"CSS3", level:90, icon:<span className="text-[#2d9aff]">◆</span>},
      {name:"JavaScript", level:88, icon:<SiJavascript className="text-[#f2d342"/>},
      {name:"React", level:85, icon:<SiReact className="text-[#54e1ff"/>},
      {name:"Bootstrap", level:90, icon:<SiBootstrap className="text-[#9770ff"/>},
    ]},
    {title:"Back-end", icon:<FiServer/>, items:[
      {name:"PHP", level:88, icon:<SiPhp className="text-[#8a94d6"/>},
      {name:"Laravel", level:85, icon:<SiLaravel className="text-[#ff5a46"/>},
      {name:"MySQL", level:82, icon:<SiMysql className="text-[#3d9bd7"/>},
      {name:"MongoDB", level:75, icon:<span className="text-[#4db33d]">◆</span>},
    ]},
    {title:"Outils & Méthodes", icon:<FiCpu/>, items:[
      {name:"Git / GitLab", level:88, icon:<SiGit className="text-[#f0643d"/>},
      {name:"GitHub", level:85, icon:<FiGithub/>},
      {name:"Agile Scrum", level:80, icon:<FiGrid/>},
      {name:"VS Code", level:92, icon:<span className="text-[#3b9ff8]">▣</span>},
    ]},
    {title:"Compétences Info", icon:<FiDatabase/>, items:[
      {name:"Bases de données", level:85, icon:<FiDatabase/>},
      {name:"Algorithmique", level:82, icon:<span className="text-[#f59e42]">◈</span>},
      {name:"Structures de données", level:80, icon:<span className="text-[#6fb8ff]">◆</span>},
      {name:"Analyse & résolution", level:85, icon:<FiZap/>},
    ]},
  ];
  return(
    <section id="skills" className="py-[98px] relative">
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg, rgba(255,255,255,.014), transparent 20%, transparent 78%, rgba(255,255,255,.014))"}}/>
      <div className="relative z-10 max-w-[1196px] mx-auto px-5 lg:px-8">
        <div className="text-center max-w-[700px] mx-auto mb-[54px]">
          <SectionEyebrow text="Compétences"/>
          <h2 className="text-[38px] md:text-[49px] font-[820] text-[#f2f7ff] font-[Poppins] tracking-[-0.022em]">Compétences <span style={{background:"linear-gradient(92deg,#62c9ff,#b38aff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Techniques</span></h2>
          <p className="text-[#9fc1e6] text-[15.6px] mt-2">Un ensemble complet de compétences pour concevoir, développer et déployer des applications modernes.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {groups.map(g=>(
            <div key={g.title} className="rounded-[24px] border border-white/[0.085] p-[26px]"
              style={{background:"linear-gradient(180deg, rgba(255,255,255,.041), rgba(255,255,255,.016))", boxShadow:"inset 0 1px 0 rgba(255,255,255,.058), 0 18px 52px rgba(5,15,36,.30)"}}
            >
              <div className="text-[16px] font-[710] text-[#e7f0ff] font-[Poppins] flex items-center gap-2 mb-5">
                <span className="text-[#7babff] text-[19px]">{g.icon}</span>{g.title}
              </div>
              <div className="space-y-[16px]">
                {g.items.map(s=><SkillBar key={s.name} {...s}/>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[SiReact,SiLaravel,SiJavascript,SiTypescript,SiTailwindcss,SiVuedotjs,SiNodedotjs,SiFigma].map((Icon, i)=>(
            <motion.div key={i} animate={{y:[0,-6,0]}} transition={{duration:2.5+i*0.14, repeat:Infinity, ease:"easeInOut"}}
              className="w-[54px] h-[54px] rounded-[15px] border border-white/[0.082] bg-white/[0.024] flex items-center justify-center text-[23px] text-[#bfd7ff]"
            ><Icon/></motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = ()=>{
  const list=[
    {title:"Todo List Application", desc:"Application de gestion de tâches permettant aux utilisateurs de créer, modifier, supprimer et organiser des tâches efficacement.", stack:["React","Bootstrap","LocalStorage"], grad:"linear-gradient(135deg,#295cff,#6a6cff 70%)", accent:"#3B82F6"},
    {title:"MedCare", desc:"Plateforme de gestion de santé conçue pour faciliter le suivi des patients, la prise de rendez-vous et la gestion des dossiers médicaux.", stack:["Laravel","React","MySQL","Bootstrap"], grad:"linear-gradient(135deg,#6a47ff,#b05fff 74%)", accent:"#8B5CF6"},
    {title:"Rock Paper Scissors", desc:"Jeu interactif développé en JavaScript avec suivi des scores, animations et design responsive.", stack:["HTML","CSS","JavaScript"], grad:"linear-gradient(135deg,#0ab8dc,#3ad8ff 70%)", accent:"#06B6D4"},
    {title:"E-Commerce Website", desc:"Boutique en ligne moderne avec catalogue de produits, panier d'achat, authentification, flux de paiement et expérience utilisateur responsive.", stack:["React","Laravel","MySQL","Bootstrap"], grad:"linear-gradient(135deg,#ff6a48,#ffad52 74%)", accent:"#ff7b42"},
  ];
  return(
    <section id="projects" className="py-[100px]">
      <div className="max-w-[1196px] mx-auto px-5 lg:px-8">
        <div className="text-center max-w-[710px] mx-auto mb-[54px]">
          <SectionEyebrow text="Projets"/>
          <h2 className="text-[39px] md:text-[50px] font-[820] text-[#f2f7ff] font-[Poppins]">Mes Projets</h2>
          <p className="text-[#a3c0e4] text-[15.6px] mt-2">Une sélection de projets démontrant mes compétences Full Stack.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-[22px]">
          {list.map((p,i)=>(
            <motion.div key={p.title}
              initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{delay:i*.07}}
              whileHover={{y:-6}}
              className="rounded-[24px] border border-white/[0.095] overflow-hidden hover-target"
              style={{background:"linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.019))", boxShadow:"0 18px 60px rgba(3,12,33,.34), inset 0 1px 0 rgba(255,255,255,.074)"}}
            >
              <div className="h-[210px] relative flex items-center justify-center" style={{background:p.grad}}>
                <div className="absolute inset-0 opacity-[0.14]" style={{backgroundImage:"radial-gradient(white .9px, transparent .9px)", backgroundSize:"16px 16px"}}/>
                <div className="text-white text-center relative">
                  <div className="text-[11px] tracking-[.16em] font-[700] opacity-90 mb-1">PROJET</div>
                  <div className="font-[Poppins] text-[27px] font-[800]">{p.title.split(" ")[0]}</div>
                </div>
                <div className="absolute top-4 right-4 text-[11.4px] px-[10px] py-[5px] rounded-full bg-white/[0.18] text-white font-[640]">En Vedette</div>
              </div>
              <div className="p-[23px]">
                <div className="text-[19px] font-[720] text-[#edf5ff] font-[Poppins] mb-2">{p.title}</div>
                <p className="text-[#9fbcdf] text-[14.25px] leading-[1.62] mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-[7px] mb-5">
                  {p.stack.map(s=><span key={s} className="px-[11px] py-[5.5px] rounded-full text-[11.6px] font-[620] text-[#c8dbf5] border border-white/[0.095] bg-white/[0.028]">{s}</span>)}
                </div>
                <div className="flex gap-3">
                  <a href="#" onClick={e=>e.preventDefault()}
                    className="flex-1 text-center py-[12px] rounded-[13px] text-white text-[13.6px] font-[670] flex items-center justify-center gap-2"
                    style={{background:p.grad, boxShadow:`0 9px 24px ${p.accent}36`}}
                  ><FiExternalLink/> Démo</a>
                  <a href="#" onClick={e=>e.preventDefault()}
                    className="px-[15px] py-[12px] rounded-[13px] border border-white/[0.15] bg-white/[0.028] text-[#d9e8ff] text-[13.5px] font-[620] flex items-center gap-2"
                  ><FiGithub/> Code</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = ()=>(
  <section id="experience" className="py-[98px]">
    <div className="max-w-[980px] mx-auto px-5 lg:px-8">
      <div className="text-center mb-[56px]">
        <SectionEyebrow text="Parcours"/>
        <h2 className="text-[39px] md:text-[49px] font-[820] text-[#f2f7ff] font-[Poppins]">Expérience & Formation</h2>
      </div>
      <div className="relative">
        <div className="absolute left-[21px] md:left-1/2 top-1 bottom-2 w-[2px] md:-translate-x-1/2"
          style={{background:"linear-gradient(180deg,#3d8bff,#8f5dff 56%, #25cfe9 100%)", boxShadow:"0 0 24px rgba(92,134,255,.26)"}}/>
        <div className="space-y-11">
          <div className="relative pl-[60px] md:pl-0 md:grid md:grid-cols-2 md:gap-10">
            <div className="md:text-right md:pr-12">
              <div className="inline-block text-[11.6px] font-[710] px-3 py-[5px] rounded-full text-[#c1eaff] bg-[#13345c]/70 border border-[#3b82f64a] mb-[11px]">2024 — 2026</div>
              <h3 className="text-[22px] font-[750] text-[#f3f7ff] font-[Poppins]">Développeur Web Full Stack</h3>
              <div className="text-[#7abaff] text-[13.5px] font-[610] mt-1">OFPPT - ISTA SEFROU</div>
            </div>
            <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-[6px] w-[20px] h-[20px] rounded-full border-[4px] border-[#0f172a] bg-[#54a8ff]" style={{boxShadow:"0 0 0 6px rgba(59,130,246,.16)"}}/>
            <div className="md:pl-12 mt-4 md:mt-0">
              <div className="rounded-[18px] border border-white/[0.089] bg-white/[0.025] px-[18px] py-[16px]">
                <p className="text-[13.8px] text-[#a9c4e7] leading-[1.65] mb-3">
                  Formation en Développement Digital avec spécialisation Full Stack. Développement de compétences en création d'applications web complètes.
                </p>
                <ul className="text-[13.5px] text-[#9fb8d6] space-y-[8px]">
                  {["Développement Front-end & Back-end","Création d'applications web modernes","Gestion de bases de données","Méthodologie Agile Scrum","Projets pratiques"].map(x=>(
                    <li key={x} className="flex gap-[9px]"><span className="mt-[6px] w-[6px] h-[6px] rounded-full" style={{background:"#4ca8ff", boxShadow:"0 0 10px #4ca8ff77"}}/>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="relative pl-[60px] md:pl-0 md:grid md:grid-cols-2 md:gap-10 opacity-[0.88]">
            <div className="md:text-right md:pr-12 md:order-1">
              <div className="inline-block text-[11.6px] font-[710] px-3 py-[5px] rounded-full text-[#dec7ff] bg-[#2a1b45]/70 border border-[#8b5cf64a] mb-[11px]">2023</div>
              <h3 className="text-[20px] font-[710] text-[#e6eeff] font-[Poppins]">Baccalauréat</h3>
              <div className="text-[#b798ff] text-[13.2px] font-[610] mt-1">Lycée Qualifiant Badr</div>
            </div>
            <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-[6px] w-[16px] h-[16px] rounded-full border-[4px] border-[#0f172a] bg-[#a978ff]"/>
            <div className="md:pl-12 mt-4 md:mt-0 md:order-2">
              <div className="rounded-[18px] border border-white/[0.069] bg-white/[0.017] px-[18px] py-[14px] text-[13.6px] text-[#94b1d6]">
                Diplôme de fin d'études secondaires. Base académique solide pour poursuivre dans l'enseignement supérieur en développement digital.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Services = ()=>{
  const svc=[
    {t:"Développement Front-end", d:"Interfaces React modernes, animations, accessibilité.", ic:<FiCode/>, c:"#3B82F6"},
    {t:"Développement Back-end", d:"APIs Laravel, authentification, architecture scalable.", ic:<FiServer/>, c:"#8B5CF6"},
    {t:"Applications Full Stack", d:"Produits complets de la base de données à l'UI.", ic:<FiLayers/>, c:"#06B6D4"},
    {t:"Bases de Données", d:"Modélisation et optimisation MySQL, MongoDB.", ic:<FiDatabase/>, c:"#22c55e"},
    {t:"Développement d'APIs", d:"APIs REST sécurisées, documentation, intégrations.", ic:<FiGrid/>, c:"#f59e0b"},
    {t:"Optimisation Web", d:"Performance, Core Web Vitals, SEO.", ic:<FiZap/>, c:"#ef6b6b"},
  ];
  return(
    <section id="services" className="py-[96px]">
      <div className="max-w-[1196px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-[52px]">
          <SectionEyebrow text="Services"/>
          <h2 className="text-[38px] md:text-[48px] font-[820] text-[#f2f7ff] font-[Poppins]">Mes Services</h2>
          <p className="text-[#97b8dd] text-[15.5px] mt-2">Ingénierie de qualité professionnelle avec une sensibilité design.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {svc.map((s,i)=>(
            <motion.div key={s.t}
              initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{delay:i*0.05}}
              whileHover={{y:-6}}
              className="rounded-[22px] p-[24px] border border-white/[0.086] relative overflow-hidden group"
              style={{background:"linear-gradient(180deg, rgba(255,255,255,.040), rgba(255,255,255,.016))"}}
            >
              <div className="absolute -right-10 -top-10 w-[118px] h-[118px] rounded-full blur-[52px] opacity-[0.23] group-hover:opacity-[0.39] transition-opacity"
                style={{background:`radial-gradient(circle, ${s.c}cc, transparent 65%)`}}/>
              <div className="w-[52px] h-[52px] rounded-[15px] flex items-center justify-center text-white text-[23px] mb-4"
                style={{background:`linear-gradient(135deg, ${s.c}, ${s.c}c9)`, boxShadow:`0 8px 26px ${s.c}44`}}>{s.ic}</div>
              <div className="text-white font-[700] text-[16.5px] font-[Poppins] mb-[8px]">{s.t}</div>
              <div className="text-[#9bb9de] text-[13.65px] leading-[1.6]">{s.d}</div>
              <div className="mt-4 text-[12.7px] font-[650] flex items-center gap-1" style={{color:s.c}}>En savoir plus <FiArrowUpRight/></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ()=>{
  const [vals,setVals]=useState({name:"",email:"",subject:"",message:""});
  const [touched,setTouched]=useState({});
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);

  const err=(k,v)=>{
    if(!touched[k]) return "";
    if(!v.trim()) return "Requis";
    if(k==="email" && !/^\S+@\S+\.\S+$/.test(v)) return "Email invalide";
    if(k==="message" && v.trim().length < 10) return "Min 10 caractères";
    return "";
  };
  const errors={ name:err("name",vals.name), email:err("email",vals.email), subject:err("subject",vals.subject), message:err("message",vals.message) };
  const valid = !Object.values(errors).some(Boolean) && Object.values(vals).every(v=>v.trim().length>2);

  const submit=(e)=>{
    e.preventDefault();
    setTouched({name:true,email:true,subject:true,message:true});
    if(!valid) return;
    setBusy(true);
    setTimeout(()=>{ setBusy(false); setSent(true); setVals({name:"",email:"",subject:"",message:""}); setTouched({}); setTimeout(()=>setSent(false),3100); }, 950);
  };

  const inputBase="w-full rounded-[13px] bg-[#132040]/86 border px-[15px] py-[13px] text-[14.2px] text-[#eef6ff] outline-none placeholder-[#7f9abb] font-[Inter]";

  return(
    <section id="contact" className="py-[98px]">
      <div className="max-w-[1196px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-[52px]">
          <SectionEyebrow text="Contact"/>
          <h2 className="text-[38px] md:text-[48px] font-[820] text-[#f2f7ff] font-[Poppins]">Me Contacter</h2>
          <p className="text-[#99b9dd] text-[15.5px] mt-2">Un projet en tête ? Construisons quelque chose de génial ensemble.</p>
        </div>

        <div className="grid lg:grid-cols-[.95fr_1.1fr] gap-8">
          <div className="rounded-[26px] border border-white/[0.088] p-[30px]"
            style={{background:"linear-gradient(180deg, rgba(255,255,255,.044), rgba(255,255,255,.018))"}}>
            <div className="text-[21.5px] font-[750] text-white font-[Poppins] mb-2">Discutons</div>
            <div className="text-[#9fbcdc] text-[14.1px] mb-6">Je réponds sous 12-24h en moyenne.</div>
              <div className="space-y-[15px] text-[14.2px] text-[#c6daf3]">
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] rounded-[13px] border border-white/[0.11] bg-white/[0.029] flex items-center justify-center"><FiMail className="text-[#6db6ff]"/></div>
                <div><div className="text-[11.7px] text-[#8baee0]">Email</div>karimbettane94@gmail.com</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] rounded-[13px] border border-white/[0.11] bg-white/[0.029] flex items-center justify-center"><FaWhatsapp className="text-[#3ed58d]"/></div>
                <div><div className="text-[11.7px] text-[#8baee0]">Téléphone</div>+212 687 238 961</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] rounded-[13px] border border-white/[0.11] bg-white/[0.029] flex items-center justify-center"><FiMapPin className="text-[#f59e42]"/></div>
                <div><div className="text-[11.7px] text-[#8baee0]">Localisation</div>Sefrou - Maroc</div>
              </div>
            </div>
            <button onClick={downloadCV}
              className="inline-flex items-center justify-center gap-2 w-full mt-6 py-[13px] rounded-[13px] text-white text-[13.8px] font-[650] hover-target"
              style={{background:"linear-gradient(100deg,#3c7cf7,#8654ef)", boxShadow:"0 8px 24px rgba(84,91,255,.28)"}}
            ><FiDownload/> Télécharger mon CV</button>
            <div className="flex flex-wrap gap-[10px] mt-6">
              {[
                {Icon:FiGithub,color:"#e8f1ff"},
                {Icon:FiLinkedin,color:"#6caeff"},
                {Icon:FaFacebookF,color:"#6ca8ff"},
                {Icon:FiInstagram,color:"#e486ff"},
                {Icon:FaXTwitter,color:"#d3e8ff"},
                {Icon:FaWhatsapp,color:"#41e699"},
              ].map((s,i)=>(
                <a key={i} href="#" onClick={e=>e.preventDefault()}
                  className="w-[48px] h-[48px] rounded-[14px] border border-white/[0.10] bg-white/[0.025] flex items-center justify-center hover:-translate-y-[3px] transition-all hover-target"
                  style={{color:s.color}}
                ><s.Icon/></a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} noValidate
            className="rounded-[26px] border border-white/[0.088] p-[28px] md:p-[32px]"
            style={{background:"linear-gradient(180deg, rgba(255,255,255,.042), rgba(255,255,255,.016))"}}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {k:"name", ph:"Votre Nom", type:"text"},
                {k:"email", ph:"Adresse Email", type:"email"},
              ].map(f=>(
                <div key={f.k}>
                  <input
                    className={`${inputBase} ${errors[f.k] ? "border-[#ff6c70]":"border-[#2c4068] focus:border-[#5aa8ff]"}`}
                    placeholder={f.ph}
                    type={f.type}
                    value={vals[f.k]}
                    onChange={e=>setVals(v=>({...v,[f.k]:e.target.value}))}
                    onBlur={()=>setTouched(t=>({...t,[f.k]:true}))}
                  />
                  <div className="h-[18px] text-[11.8px] text-[#ff7480] mt-[4px]">{errors[f.k]||""}</div>
                </div>
              ))}
            </div>

            <div className="mb-[4px]">
              <input
                className={`${inputBase} ${errors.subject ? "border-[#ff6c70]":"border-[#2c4068] focus:border-[#5aa8ff]"}`}
                placeholder="Sujet"
                value={vals.subject}
                onChange={e=>setVals(v=>({...v,subject:e.target.value}))}
                onBlur={()=>setTouched(t=>({...t,subject:true}))}
              />
              <div className="h-[18px] text-[11.8px] text-[#ff7480] mt-[4px]">{errors.subject||""}</div>
            </div>

            <div>
              <textarea rows={5}
                className={`${inputBase} resize-none ${errors.message ? "border-[#ff6c70]":"border-[#2c4068] focus:border-[#5aa8ff]"}`}
                placeholder="Votre message…"
                value={vals.message}
                onChange={e=>setVals(v=>({...v,message:e.target.value}))}
                onBlur={()=>setTouched(t=>({...t,message:true}))}
              />
              <div className="h-[18px] text-[11.8px] text-[#ff7480] mt-[4px]">{errors.message||""}</div>
            </div>

            <button type="submit" disabled={busy}
              className="mt-2 px-[26px] py-[14px] rounded-[14px] text-white text-[14.5px] font-[680] inline-flex items-center gap-2 disabled:opacity-70 hover-target"
              style={{background:"linear-gradient(98deg,#3b78f5,#8a55f2)", boxShadow:"0 12px 30px rgba(89,97,255,.30)"}}
            >
              {busy ? "Envoi en cours…" : sent ? <><FiCheck/> Message envoyé</> : <>Envoyer le Message <FiSend/></>}
            </button>
            <AnimatePresence>
              {sent && (
                <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-4 text-[13.6px] text-[#8effc5] font-[600]">
                  Merci ! Je vous répondrai sous peu.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
};

const BackToTop = ()=>{
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>620);
    window.addEventListener("scroll",fn); fn();
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  return(
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.75}}
          onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          className="fixed right-[18px] bottom-[20px] z-[120] w-[50px] h-[50px] rounded-full flex items-center justify-center text-white"
          style={{background:"linear-gradient(135deg,#3b7ff5,#8b5cf6)", boxShadow:"0 10px 34px rgba(94,98,255,.38)"}}
        ><FiArrowUp/></motion.button>
      )}
    </AnimatePresence>
  );
};

const Loader = ({done,onDone})=>{
  useEffect(()=>{ if(done){ const t=setTimeout(onDone,340); return()=>clearTimeout(t);} },[done,onDone]);
  return(
    <AnimatePresence>
      {!done && (
        <motion.div initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.4}}
          className="fixed inset-0 z-[300] flex items-center justify-center" style={{background:"#0C1428"}}
        >
          <div className="text-center">
            <div className="w-[66px] h-[66px] mx-auto rounded-[18px] flex items-center justify-center text-white text-[25px] font-[820] font-[Poppins] mb-5"
              style={{background:"linear-gradient(135deg,#3B82F6,#8B5CF6)", boxShadow:"0 0 46px rgba(98,112,255,.36)"}}>
              KB
            </div>
            <div className="w-[210px] h-[4px] rounded-full bg-white/[0.10] overflow-hidden mb-[10px]">
              <motion.div initial={{x:"-100%"}} animate={{x:"100%"}} transition={{repeat:Infinity,duration:1.12,ease:"easeInOut"}}
                className="h-full w-[38%]" style={{background:"linear-gradient(90deg,transparent,#7ab8ff,#b48cff,transparent)"}}
              />
            </div>
            <div className="text-[12.5px] text-[#8ab1d9]">Chargement du portfolio…</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App(){
  const [loading,setLoading]=useState(true);
  const [ready,setReady]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setLoading(false), 1100); return()=>clearTimeout(t); },[]);
  useEffect(()=>{
    if(!ready) return;
    const ctx = gsap.context(()=>{
      gsap.utils.toArray(".gs-reveal").forEach(el=>{
        gsap.from(el,{ y:38, opacity:0, duration:.70, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 84%" }});
      });
    });
    return()=>ctx.revert();
  },[ready]);

  return(
    <div className="min-h-screen text-[#F8FAFC] overflow-x-clip antialiased" style={{background:COLORS.bg, fontFamily:"Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif"}}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800;900&display=swap');
html{scroll-behavior:smooth}
body{margin:0;background:${COLORS.bg};color:${COLORS.text}}
*{ -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;}
::selection{background:rgba(59,130,246,.33); color:#fff;}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#0e1a31}
::-webkit-scrollbar-thumb{background:linear-gradient(#3B82F6,#8B5CF6);border-radius:99px}
button,a{cursor:pointer}
`}</style>

      <Loader done={!loading} onDone={()=>setReady(true)} />
      {ready && (
        <>
          <ScrollProgressBar/>
          <MouseFollower/>
          <Navbar/>
          <main>
            <Hero/>
            <div className="gs-reveal"><Skills/></div>
            <div className="gs-reveal"><Projects/></div>
            <div className="gs-reveal"><Experience/></div>
            <div className="gs-reveal"><Services/></div>
            <div className="gs-reveal"><Contact/></div>
          </main>
          <footer className="border-t border-white/[0.082] mt-8" style={{background:"linear-gradient(180deg, rgba(255,255,255,.015), rgba(255,255,255,.004))"}}>
            <div className="max-w-[1196px] mx-auto px-5 lg:px-8 py-[46px]">
              <div className="grid md:grid-cols-3 gap-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-white font-[800] font-[Poppins]" style={{background:"linear-gradient(135deg,#3B82F6,#8B5CF6)"}}>KB</div>
                    <div>
                      <div className="text-white font-[720]">Karim Bettane</div>
                      <div className="text-[#86a9cf] text-[12.4px]">Développeur Full Stack</div>
                    </div>
                  </div>
                  <div className="text-[#96b7da] text-[13.75px] max-w-[310px] leading-[1.64]">Création d'expériences digitales innovantes.</div>
                </div>
                <div>
                  <div className="text-white font-[680] text-[14.3px] mb-4">Liens Rapides</div>
                  <div className="grid grid-cols-2 gap-y-[11px] text-[13.6px] text-[#9fbddf]">
                    {[{l:"Accueil",i:0},{l:"Profil",i:1},{l:"Compétences",i:2},{l:"Projets",i:3},{l:"Contact",i:4}].map(item=>{
                      const ids=["home","about","skills","projects","contact"];
                      return <button key={item.l} onClick={()=>document.getElementById(ids[item.i])?.scrollIntoView({behavior:"smooth"})} className="text-left hover:text-[#d7ebff] transition">{item.l}</button>
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-white font-[680] text-[14.3px] mb-4">Réseaux</div>
                  <div className="flex gap-[9px] flex-wrap">
                    {[
                      {Icon:FiGithub, c:"#dfe9ff"},
                      {Icon:FiLinkedin, c:"#6eaeff"},
                      {Icon:FaFacebookF, c:"#6ea6ff"},
                      {Icon:FiInstagram, c:"#df8eff" },
                      {Icon:FaXTwitter, c:"#d7ecff"},
                      {Icon:FaWhatsapp, c:"#3ae399"},
                    ].map((s,i)=>(
                      <a key={i} href="#" onClick={e=>e.preventDefault()}
                        className="w-[41px] h-[41px] rounded-[11px] border border-white/[0.10] bg-white/[0.022] flex items-center justify-center hover:-translate-y-[2px] transition"
                        style={{color:s.c}}
                      ><s.Icon/></a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-[30px] pt-[20px] border-t border-white/[0.068] text-[12.8px] text-[#8aa8ce]">
                <div>Karim Bettane © 2026 — Tous droits réservés.</div>
                <div className="flex items-center gap-5"><span>Fait avec React & Passion</span><span className="opacity-70">•</span><span>Sefrou, Maroc</span></div>
              </div>
            </div>
          </footer>
          <BackToTop/>
        </>
      )}
    </div>
  );
}
