// CFnew - 终端 v3.1
// 版本: v3.1 
import { connect as 连接 } from 'cloudflare:sockets';
const 基础64文本解码器 = new TextDecoder();
function 解码64(文本) {
  const 二进制 = atob(文本);
  const 字节 = new Uint8Array(二进制.length);
  for (let 索引 = 0; 索引 < 二进制.length; 索引++) 字节[索引] = 二进制.charCodeAt(索引);
  return 基础64文本解码器.decode(字节);
}
let 认证令牌 = '351c9981-04b6-4103-aa4b-864aa9c91469';
let 回退地址 = '';
let 代理5配置 = '';
let 自定义优选地址列表 = [];
let 自定义优选域名列表 = [];
let 启用代理降级 = false;
let 仅走代理 = false;
let 禁用非传输层安全 = false;
let 禁用优选 = false;
let 启用地区匹配 = true;
let 当前工作器地区 = '';
let 手动工作器地区 = '';
let 优选地址源 = '';
let 自定义路径 = '';
let 启用明文 = true;
let 启用木马 = false;
let 启用扩展传输 = false;
let 传输路径 = '';
// 启用ECH功能（true启用，false禁用）
let 启用加密客户端问候 = false;
// 自定义DNS服务器（默认：https://223.5.5.5/dns-query）
let 自定义域名系统 = 'https://223.5.5.5/dns-query';
// 自定义ECH域名（默认：cloudflare-ech.com）
let 自定义加密客户端问候域名 = 'cloudflare-ech.com';
let 自定义应用层协议协商 = '';
let 订阅转换接口 = 解码64('aHR0cHM6Ly91cmwudjEubWsvc3Vi');
// 远程配置URL（硬编码）
const 远程配置网址 = 'https://raw.githubusercontent.com/byJoey/test/refs/heads/main/tist.ini';
let 启用优选域名 = true; // 优选域名默认关闭
let 启用优选地址 = true;
let 启用仓库优选 = true;
let 启用原生地址 = false; // 原生地址默认关闭          
// 家宽链式：cfnew 自己的节点当前置，落地换成住宅宽带
let 启用家宽链式 = false;

let 键值存储 = null;
let 键值配置 = {};
let 键值配置上次加载 = 0;
const 键值缓存期限 = 30 * 1000; // 30秒缓存（短窗口内跳过版本检查）
let 键值配置版本 = '';
const 配置默认值 = {
  wk: '',
  ev: 'yes',
  et: 'no',
  ex: 'no',
  ech: 'no',
  tp: '',
  customDNS: 'https://223.5.5.5/dns-query',
  customECHDomain: 'cloudflare-ech.com',
  alpn: '',
  d: '',
  p: '',
  yx: '',
  yxURL: '',
  s: '',
  homepage: '',
  scu: 解码64('aHR0cHM6Ly91cmwudjEubWsvc3Vi'),
  ena: 'no',
  epd: 'yes',
  epi: 'yes',
  egi: 'yes',
  ae: '',
  rm: '',
  qj: '',
  dkby: 'no',
  yxby: '',
  ipv4: 'yes',
  ipv6: 'yes',
  ispMobile: 'yes',
  ispUnicom: 'yes',
  ispTelecom: 'yes',
  jk: 'no'
};

function 是否开启值(值, 默认启用 = false) {
  if (值 === undefined || 值 === null || 值 === '') return 默认启用;
  if (值 === true || 值 === false) return 值;
  const 文本 = String(值).trim().toLowerCase();
  if (文本 === 'yes' || 文本 === 'true' || 文本 === '1' || 文本 === 'on') return true;
  if (文本 === 'no' || 文本 === 'false' || 文本 === '0' || 文本 === 'off') return false;
  return 默认启用;
}

function 归一配置开关(值, 默认启用 = false) {
  return 是否开启值(值, 默认启用) ? 'yes' : 'no';
}

function 获取配置开关值(键, 默认启用 = false, 备用值 = undefined) {
  const 默认值 = 备用值 !== undefined ? 备用值 : (默认启用 ? 'yes' : 'no');
  return 是否开启值(获取配置值(键, 默认值), 默认启用);
}

function 获取配置文本值(键, 默认值 = '', 备用值 = undefined) {
  const 值 = 获取配置值(键, 备用值 !== undefined ? 备用值 : 默认值);
  return 值 === undefined || 值 === null ? 默认值 : String(值);
}

function 整理有效配置(配置) {
  const 快照 = {
    ...配置默认值,
    ...配置
  };
  ['ev', 'et', 'ex', 'ech', 'ena', 'epd', 'epi', 'egi', 'ipv4', 'ipv6', 'ispMobile', 'ispUnicom', 'ispTelecom', 'jk'].forEach(键 => {
    快照[键] = 归一配置开关(快照[键], 是否开启值(配置默认值[键]));
  });
  if (快照.ev === 'no' && 快照.et === 'no' && 快照.ex === 'no') {
    快照.ev = 'yes';
  }
  if (快照.ech === 'yes') {
    快照.dkby = 'yes';
  }
  return 快照;
}

function 读取环境配置值(环境值, ...名称列表) {
  if (!环境值) return undefined;
  for (const 名称 of 名称列表) {
    if (环境值[名称] !== undefined && 环境值[名称] !== null && 环境值[名称] !== '') {
      return 环境值[名称];
    }
  }
  return undefined;
}

function 获取环境配置快照(环境值 = {}) {
  const 映射 = {
    wk: ['wk', 'WK'],
    ev: ['ev', 'EV'],
    et: ['et', 'ET'],
    ex: ['ex', 'EX'],
    ech: ['ech', 'ECH'],
    tp: ['tp', 'TP'],
    customDNS: ['customDNS', 'CUSTOMDNS', 'CUSTOM_DNS'],
    customECHDomain: ['customECHDomain', 'CUSTOMECHDOMAIN', 'CUSTOM_ECH_DOMAIN'],
    alpn: ['alpn', 'ALPN'],
    d: ['d', 'D'],
    p: ['p', 'P'],
    yx: ['yx', 'YX'],
    yxURL: ['yxURL', 'YXURL', 'YX_URL'],
    s: ['s', 'S'],
    homepage: ['homepage', 'HOMEPAGE'],
    scu: ['scu', 'SCU'],
    ena: ['ena', 'ENA'],
    epd: ['epd', 'EPD'],
    epi: ['epi', 'EPI'],
    egi: ['egi', 'EGI'],
    ae: ['ae', 'AE'],
    rm: ['rm', 'RM'],
    qj: ['qj', 'QJ'],
    dkby: ['dkby', 'DKBY'],
    yxby: ['yxby', 'YXBY'],
    ipv4: ['ipv4', 'IPV4'],
    ipv6: ['ipv6', 'IPV6'],
    ispMobile: ['ispMobile', 'ISPMOBILE', 'ISP_MOBILE'],
    ispUnicom: ['ispUnicom', 'ISPUNICOM', 'ISP_UNICOM'],
    ispTelecom: ['ispTelecom', 'ISPTELECOM', 'ISP_TELECOM'],
    jk: ['jk', 'JK']
  };
  const 快照 = {};
  for (const [键, 名称列表] of Object.entries(映射)) {
    const 值 = 读取环境配置值(环境值, ...名称列表);
    if (值 !== undefined) 快照[键] = 值;
  }
  return 快照;
}

function 获取有效配置快照(环境值 = {}) {
  return 整理有效配置({
    ...获取环境配置快照(环境值),
    ...键值配置
  });
}
const 地区映射 = {
  'HK': ['🇭🇰 香港', 'HK', 'Hong Kong'],
  'US': ['🇺🇸 美国', 'US', 'United States'],
  'SG': ['🇸🇬 新加坡', 'SG', 'Singapore'],
  'JP': ['🇯🇵 日本', 'JP', 'Japan'],
  'KR': ['🇰🇷 韩国', 'KR', 'South Korea'],
  'DE': ['🇩🇪 德国', 'DE', 'Germany'],
  'SE': ['🇸🇪 瑞典', 'SE', 'Sweden'],
  'NL': ['🇳🇱 荷兰', 'NL', 'Netherlands'],
  'FI': ['🇫🇮 芬兰', 'FI', 'Finland'],
  'GB': ['🇬🇧 英国', 'GB', 'United Kingdom'],
  'Oracle': ['甲骨文', 'Oracle'],
  'DigitalOcean': ['数码海', 'DigitalOcean'],
  'Vultr': ['Vultr', 'Vultr'],
  'Multacom': ['Multacom', 'Multacom']
};
// 官方直连地址池：内置实测可用地址，不依赖任何第三方域名
// CF 是任播，同一地址在不同位置落到的机房不同，所以不按地区区分
const 官方直连地址 = 解码64('MTcyLjcxLjIxOC4xOTAsMTYyLjE1OC4yMjguODcsMTYyLjE1OC4xODkuMTM0LDE2Mi4xNTguMjYuNjMsMTYyLjE1OC4yNS44NiwxNjIuMTU4LjI5LjIxNiwxNjIuMTU4LjIxOC4xNjAsMTYyLjE1OC4yMjcuMjE0LDE3Mi42OS4xMTguMTk4LDE3Mi42OS4xMTkuMTUw').split(',');
function 取官方直连地址() {
  const 命中 = 官方直连地址[Math.floor(Math.random() * 官方直连地址.length)];
  return {
    domain: 命中,
    region: 'CF',
    regionCode: 'CF',
    port: 443
  };
}
let 备用地址列表 = [{
  domain: 解码64('UHJveHlJUC5ISy5DTUxpdXNzc3MubmV0'),
  region: 'HK',
  regionCode: 'HK',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5VUy5DTUxpdXNzc3MubmV0'),
  region: 'US',
  regionCode: 'US',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5TRy5DTUxpdXNzc3MubmV0'),
  region: 'SG',
  regionCode: 'SG',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5KUC5DTUxpdXNzc3MubmV0'),
  region: 'JP',
  regionCode: 'JP',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5LUi5DTUxpdXNzc3MubmV0'),
  region: 'KR',
  regionCode: 'KR',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5ERS5DTUxpdXNzc3MubmV0'),
  region: 'DE',
  regionCode: 'DE',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5TRS5DTUxpdXNzc3MubmV0'),
  region: 'SE',
  regionCode: 'SE',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5OTC5DTUxpdXNzc3MubmV0'),
  region: 'NL',
  regionCode: 'NL',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5GSS5DTUxpdXNzc3MubmV0'),
  region: 'FI',
  regionCode: 'FI',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5HQi5DTUxpdXNzc3MubmV0'),
  region: 'GB',
  regionCode: 'GB',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5PcmFjbGUuY21saXVzc3NzLm5ldA=='),
  region: 'Oracle',
  regionCode: 'Oracle',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5EaWdpdGFsT2NlYW4uQ01MaXVzc3NzLm5ldA=='),
  region: 'DigitalOcean',
  regionCode: 'DigitalOcean',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5WdWx0ci5DTUxpdXNzc3MubmV0'),
  region: 'Vultr',
  regionCode: 'Vultr',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5NdWx0YWNvbS5DTUxpdXNzc3MubmV0'),
  region: 'Multacom',
  regionCode: 'Multacom',
  port: 443
}];
const 直连域名列表 = [{
  name: "cloudflare.182682.xyz",
  domain: "cloudflare.182682.xyz"
}, {
  name: "speed.marisalnc.com",
  domain: "speed.marisalnc.com"
}, {
  domain: "freeyx.cloudflare88.eu.org"
}, {
  domain: "bestcf.top"
}, {
  domain: "cdn.2020111.xyz"
}, {
  domain: "cfip.cfcdn.vip"
}, {
  domain: "cf.0sm.com"
}, {
  domain: "cf.090227.xyz"
}, {
  domain: "cf.zhetengsha.eu.org"
}, {
  domain: "cloudflare.9jy.cc"
}, {
  domain: "cf.zerone-cdn.pp.ua"
}, {
  domain: "cfip.1323123.xyz"
}, {
  domain: "cnamefuckxxs.yuchen.icu"
}, {
  domain: "cloudflare-ip.mofashi.ltd"
}, {
  domain: "115155.xyz"
}, {
  domain: "cname.xirancdn.us"
}, {
  domain: "f3058171cad.002404.xyz"
}, {
  domain: "8.889288.xyz"
}, {
  domain: "cdn.tzpro.xyz"
}, {
  domain: "cf.877771.xyz"
}, {
  domain: "xn--b6gac.eu.org"
}];
const 错误_无效数据 = atob('aW52YWxpZCBkYXRh');
const 错误_无效用户 = atob('aW52YWxpZCB1c2Vy');
const 错误_不支持命令 = atob('Y29tbWFuZCBpcyBub3Qgc3VwcG9ydGVk');
const 错误_仅支持域名系统用户数据报 = atob('VURQIHByb3h5IG9ubHkgZW5hYmxlIGZvciBETlMgd2hpY2ggaXMgcG9ydCA1Mw==');
const 错误_无效地址类型 = atob('aW52YWxpZCBhZGRyZXNzVHlwZQ==');
const 错误_空地址 = atob('YWRkcmVzc1ZhbHVlIGlzIGVtcHR5');
const 错误_网页套接字未打开 = atob('d2ViU29ja2V0LmVhZHlTdGF0ZSBpcyBub3Qgb3Blbg==');
const 错误_无效标识字符串 = atob('U3RyaW5naWZpZWQgaWRlbnRpZmllciBpcyBpbnZhbGlk');
const 错误_无效代理地址 = atob('SW52YWxpZCBTT0NLUyBhZGRyZXNzIGZvcm1hdA==');
const 错误_代理无可用方法 = atob('bm8gYWNjZXB0YWJsZSBtZXRob2Rz');
const 错误_代理需要认证 = atob('c29ja3Mgc2VydmVyIG5lZWRzIGF1dGg=');
const 错误_代理认证失败 = atob('ZmFpbCB0byBhdXRoIHNvY2tzIHNlcnZlcg==');
const 错误_代理连接失败 = atob('ZmFpbCB0byBvcGVuIHNvY2tzIGNvbm5lY3Rpb24=');
const 错误_代理隧道失败 = atob('ZmFpbCB0byBvcGVuIHByb3h5IHR1bm5lbA==');
const 错误_代理响应异常 = atob('aW52YWxpZCBwcm94eSByZXNwb25zZQ==');
const 前缀_套接字5 = atob('c29ja3M1Oi8v');
const 前缀_套接字 = atob('c29ja3M6Ly8=');
const 前缀_超文本 = atob('aHR0cDovLw==');
const 前缀_安全超文本 = atob('aHR0cHM6Ly8=');
const 文本_连接方法 = atob('Q09OTkVDVA==');
const 文本_协议版本 = atob('IEhUVFAvMS4x');
const 文本_主机头 = atob('SG9zdDog');
const 文本_代理认证头 = atob('UHJveHktQXV0aG9yaXphdGlvbjogQmFzaWMg');
const 文本_代理保持 = atob('UHJveHktQ29ubmVjdGlvbjogS2VlcC1BbGl2ZQ==');
const 文本_用户代理头 = atob('VXNlci1BZ2VudDogTW96aWxsYS81LjA=');
const 文本_换行 = atob('DQo=');
const 文本_响应前缀 = atob('SFRUUC8=');
const 代理种类_套接字5 = 'p5';
const 代理种类_隧道 = 'pt';
const 代理种类_安全隧道 = 'pts';
let 已解析代理5配置 = {};
let 是否代理已启用 = false;
const 地址类型_四版 = 1;
const 地址类型_网址 = 2;
const 地址类型_六版 = 3;
const 传输块大小 = 64 * 1024;
const 传输下载包大小 = 32 * 1024;
const 传输下载尾部 = 512;
const 传输下载延迟 = 0;
const 传输上传包大小 = 16 * 1024;
const 传输上传队列上限 = 256 * 1024;
const 传输连接竞速数 = 2;
const 首字节超时 = 3500;
const 共享解码器 = new TextDecoder();
const 唯一标识字节缓存 = new Map();
function 是否有效格式(字符串) {
  const 用户正则 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return 用户正则.test(字符串);
}
function 是否有效地址(地址792) {
  const 值4正则 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (值4正则.test(地址792)) return true;
  const 值6正则 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (值6正则.test(地址792)) return true;
  const 值6值正则 = /^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
  if (值6值正则.test(地址792)) return true;
  return false;
}
function 创建节点命名器(跳过 = false) {
  // 如果配置了 yxURL，则跳过编号
  const 值跳过 = typeof 优选地址源 !== 'undefined' && 优选地址源 && 优选地址源.trim();
  let 跳过编号791 = 值跳过 || 跳过;
  const 计数器组790 = {};
  function 设置跳过编号(本地值789) {
    if (!值跳过) {
      跳过编号791 = 本地值789;
    }
  }
  function 处理命名器(基础名称, 节点名称788 = null) {
    if (跳过编号791 || 基础名称 && 基础名称.includes('.')) {
      return 节点名称788 || 基础名称;
    }
    if (!计数器组790[基础名称]) 计数器组790[基础名称] = 0;
    计数器组790[基础名称]++;
    const 索引787 = String(计数器组790[基础名称]).padStart(2, '0');
    return `${节点名称788 || 基础名称}-${索引787}`;
  }
  return {
    namer: 处理命名器,
    setSkipNumbering: 设置跳过编号
  };
}
function 规范化节点主机(主机786) {
  return String(主机786 || '').trim().replace(/^\[([^\]]+)\]$/, '$1');
}
function 处理值节点别名部分(值785, 回退 = 'Node') {
  let 文本784 = String(值785 || '').trim();
  if (!文本784 || /^自定义优选-/i.test(文本784)) 文本784 = 回退;
  文本784 = 文本784.replace(/^\[([^\]]+)\]$/, '$1').replace(/^https?:\/\//i, '').replace(/[/?#].*$/, '').replace(/\s+/g, '_');
  return 文本784 || 回退;
}
function 获取值节点别名基础(项目783) {
  const 主机782 = 规范化节点主机(项目783?.ip || 项目783?.domain || '');
  if (主机782 && 主机782.includes(':') && /^[0-9a-fA-F:.]+$/.test(主机782)) return 'IPv6优选';
  if (主机782 && !是否有效地址(主机782)) return '优选域名';
  const 本地值781 = 处理值节点别名部分(项目783?.isp || 项目783?.name || '', 'IPv4优选');
  const 机房780 = 处理值节点别名部分(项目783?.colo || '', '');
  return 机房780 ? `${本地值781}-${机房780}` : 本地值781;
}
function 创建值节点命名器(跳过编号779 = false) {
  const 计数器组 = {};
  return 项目778 => {
    const 基础 = 获取值节点别名基础(项目778);
    if (跳过编号779) return 基础;
    计数器组[基础] = (计数器组[基础] || 0) + 1;
    return `${基础}-${String(计数器组[基础]).padStart(2, '0')}`;
  };
}
function 规范化应用层协议协商(值777) {
  const 本地值776 = ['', 'h3', 'h2', 'http/1.1', 'h3,h2', 'h2,http/1.1', 'h3,h2,http/1.1'];
  const 应用层协议协商775 = String(值777 || '').trim();
  return 本地值776.includes(应用层协议协商775) ? 应用层协议协商775 : '';
}
function 处理值应用层协议协商值(参数774) {
  const 应用层协议协商 = 规范化应用层协议协商(自定义应用层协议协商);
  if (应用层协议协商) 参数774.set('alpn', 应用层协议协商);
}
async function 处理值键值值(本地值773) {
  const 键值绑定 = 本地值773.C || 本地值773.c;
  if (键值绑定) {
    try {
      键值存储 = 键值绑定;
      await 加载键值配置();
    } catch (错误772) {
      键值存储 = null;
    }
  } else {}
}
async function 加载键值配置(本地值771 = false) {
  if (!键值存储) {
    return;
  }

  // 短窗口内完全信任缓存，避免高频请求时打爆 KV
  if (!本地值771 && 键值配置上次加载 > 0 && Date.now() - 键值配置上次加载 < 键值缓存期限) {
    return;
  }
  try {
    // 读取小体积的版本键 c_ver（约 13B），用于跨 isolate 缓存失效
    let 本地值770 = '';
    try {
      本地值770 = (await 键值存储.get('c_ver')) || '';
    } catch (忽略值769) {}

    // 版本未变化且已有缓存，仅刷新时间戳，跳过完整读取
    if (!本地值771 && 本地值770 && 本地值770 === 键值配置版本 && 键值配置 && Object.keys(键值配置).length > 0) {
      键值配置上次加载 = Date.now();
      return;
    }
    const 配置数据 = await 键值存储.get('c');
    if (配置数据) {
      键值配置 = JSON.parse(配置数据);
    }
    键值配置版本 = 本地值770;
    键值配置上次加载 = Date.now();
  } catch (错误768) {
    // 读取失败时保留现有缓存，避免临时故障导致配置丢失
    if (!键值配置) 键值配置 = {};
  }
}
async function 保存键值配置() {
  if (!键值存储) {
    return;
  }
  try {
    const 配置字符串 = JSON.stringify(键值配置);
    await 键值存储.put('c', 配置字符串);
    // 写入版本号，让其它 isolate 在下次请求时能立即看到变更
    const 新值 = String(Date.now());
    键值配置版本 = 新值;
    try {
      await 键值存储.put('c_ver', 新值);
    } catch (忽略值767) {}
    键值配置上次加载 = Date.now();
  } catch (错误766) {
    throw 错误766;
  }
}
function 获取配置值(键765, 默认值 = '') {
  if (键值配置[键765] !== undefined) {
    return 键值配置[键765];
  }
  return 默认值;
}
async function 设置配置值(键764, 值763) {
  键值配置[键764] = 值763;
  await 保存键值配置();
}
async function 检查地址可用性(域名760, 端口759 = 443, 超时758 = 2000) {
  try {
    const 控制器757 = new AbortController();
    const 超时标识756 = setTimeout(() => 控制器757.abort(), 超时758);
    const 响应755 = await fetch(`https://${域名760}`, {
      method: 'HEAD',
      signal: 控制器757.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CF-IP-Checker/1.0)'
      }
    });
    clearTimeout(超时标识756);
    return 响应755.status < 500;
  } catch (错误754) {
    return true;
  }
}
async function 获取值备用地址(工作器地区753 = '', 值地区匹配752 = 启用地区匹配) {
  // 没指定地区（wk 留空=官方直连）时走内置地址，不依赖第三方域名
  if (!工作器地区753 || 工作器地区753 === 'CF') {
    return 取官方直连地址();
  }
  if (备用地址列表.length === 0) {
    return 取官方直连地址();
  }
  const 可用地址列表751 = 备用地址列表.map(地址750 => ({
    ...地址750,
    available: true
  }));
  if (值地区匹配752 && 工作器地区753) {
    const 值地址列表749 = 获取值地区值(工作器地区753, 可用地址列表751, 值地区匹配752);
    if (值地址列表749.length > 0) {
      const 已选地址748 = 值地址列表749[0];
      return 已选地址748;
    }
  }
  const 已选地址 = 可用地址列表751[0];
  return 已选地址;
}
function 获取值值(地区747) {
  const 值映射 = {
    'US': ['SG', 'JP', 'KR'],
    'SG': ['JP', 'KR', 'US'],
    'JP': ['SG', 'KR', 'US'],
    'KR': ['JP', 'SG', 'US'],
    'DE': ['NL', 'GB', 'SE', 'FI'],
    'SE': ['DE', 'NL', 'FI', 'GB'],
    'NL': ['DE', 'GB', 'SE', 'FI'],
    'FI': ['SE', 'DE', 'NL', 'GB'],
    'GB': ['DE', 'NL', 'SE', 'FI']
  };
  return 值映射[地区747] || [];
}
function 获取值值值值(地区746) {
  const 值值745 = 获取值值(地区746);
  const 值值744 = ['US', 'SG', 'JP', 'KR', 'DE', 'SE', 'NL', 'FI', 'GB'];
  return [地区746, ...值值745, ...值值744.filter(结果值743 => 结果值743 !== 地区746 && !值值745.includes(结果值743))];
}
function 获取值地区值(工作器地区, 可用地址列表, 值地区匹配 = 启用地区匹配) {
  if (!值地区匹配 || !工作器地区) {
    return 可用地址列表;
  }
  const 值值742 = 获取值值值值(工作器地区);
  const 值地址列表741 = [];
  for (const 地区 of 值值742) {
    const 地区地址列表 = 可用地址列表.filter(地址740 => 地址740.regionCode === 地区);
    值地址列表741.push(...地区地址列表);
  }
  return 值地址列表741;
}
function 解析地址值端口(输入) {
  if (输入.includes('[') && 输入.includes(']')) {
    const 本地值739 = 输入.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (本地值739) {
      return {
        address: 本地值739[1],
        port: 本地值739[2] ? parseInt(本地值739[2], 10) : null
      };
    }
  }
  const 值值索引738 = 输入.lastIndexOf(':');
  if (值值索引738 > 0) {
    const 地址737 = 输入.substring(0, 值值索引738);
    const 端口字符串 = 输入.substring(值值索引738 + 1);
    const 端口736 = parseInt(端口字符串, 10);

    // address 含 ':' 说明是裸 IPv6（如 2001:db8::1），整体当地址，无端口
    if (!地址737.includes(':') && !isNaN(端口736) && 端口736 > 0 && 端口736 <= 65535) {
      return {
        address: 地址737,
        port: 端口736
      };
    }
  }
  return {
    address: 输入,
    port: null
  };
}
export default {
  async fetch(请求735, 本地值734, 本地值733) {
    try {
      const 是否网页套接字 = 请求735.headers.get('Upgrade') === atob('d2Vic29ja2V0');
      const 是否值732 = 请求735.method === 'POST';
      const 请求网址731 = new URL(请求735.url);
      const 路径值730 = 请求网址731.pathname.split('/').filter(参数值729 => 参数值729);
      if (!是否网页套接字 && !是否值732 && 请求网址731.pathname !== '/') {
        const 值值728 = (本地值734.u || 本地值734.U || '').toLowerCase();
        const 值值727 = (本地值734.d || 本地值734.D || '').toLowerCase();
        const 首次值 = 路径值730[0] || '';
        const 清理值 = 值值727.startsWith('/') ? 值值727.substring(1) : 值值727;
        if (首次值 !== 值值728 && (清理值 ? 首次值 !== 清理值 : false)) {
          return new Response('Not Found', {
            status: 404
          });
        }
      }
      await 处理值键值值(本地值734);
      认证令牌 = (本地值734.u || 本地值734.U || 认证令牌).toLowerCase();
      const 值路径 = (本地值734.d || 本地值734.D || 认证令牌).toLowerCase();
      const 本地值726 = 获取配置值('p', 本地值734.p || 本地值734.P);
      let 值自定义地址 = false;
      const 手动地区725 = 获取配置值('wk', 本地值734.wk || 本地值734.WK);
      if (手动地区725 && 手动地区725.trim()) {
        手动工作器地区 = 手动地区725.trim().toUpperCase();
        当前工作器地区 = 手动工作器地区;
      } else if (本地值726 && 本地值726.trim()) {
        值自定义地址 = true;
        当前工作器地区 = 'CUSTOM';
      } else {
        // wk 留空 = 官方直连：直接用内置地址，不再探测地区去匹配第三方域名
        当前工作器地区 = 'CF';
      }
      const 地区匹配控制724 = 获取配置文本值('rm', 配置默认值.rm, 本地值734.rm || 本地值734.RM);
      启用地区匹配 = !(地区匹配控制724 && 地区匹配控制724.toLowerCase() === 'no');
      const 值回退723 = 获取配置文本值('p', 配置默认值.p, 本地值734.p || 本地值734.P);
      回退地址 = 值回退723 ? 值回退723.trim() : '';
      代理5配置 = 获取配置文本值('s', 配置默认值.s, 本地值734.s || 本地值734.S);
      if (代理5配置) {
        try {
          已解析代理5配置 = 解析代理配置(代理5配置);
          是否代理已启用 = true;
        } catch (错误722) {
          是否代理已启用 = false;
        }
      } else {
        已解析代理5配置 = {};
        是否代理已启用 = false;
      }
      const 自定义优选 = 获取配置值('yx', 本地值734.yx || 本地值734.YX);
      if (自定义优选) {
        try {
          const 优选列表721 = 自定义优选.split(',').map(项目720 => 项目720.trim()).filter(项目719 => 项目719);
          自定义优选地址列表 = [];
          自定义优选域名列表 = [];
          优选列表721.forEach(项目718 => {
            let 节点名称717 = '';
            let 地址部分716 = 项目718;
            if (项目718.includes('#')) {
              const 部分列表715 = 项目718.split('#');
              地址部分716 = 部分列表715[0].trim();
              节点名称717 = 部分列表715[1].trim();
            }
            const {
              address: 地址714,
              port: 端口713
            } = 解析地址值端口(地址部分716);
            if (!节点名称717) {
              节点名称717 = '自定义优选-' + 地址714 + (端口713 ? ':' + 端口713 : '');
            }
            if (是否有效地址(地址714)) {
              自定义优选地址列表.push({
                ip: 地址714,
                port: 端口713,
                isp: 节点名称717
              });
            } else {
              自定义优选域名列表.push({
                domain: 地址714,
                port: 端口713,
                name: 节点名称717
              });
            }
          });
        } catch (错误712) {
          自定义优选地址列表 = [];
          自定义优选域名列表 = [];
        }
      }
      const 值控制711 = 获取配置文本值('qj', 配置默认值.qj, 本地值734.qj || 本地值734.QJ);
      const 值控制711值 = (值控制711 || '').toLowerCase();
      启用代理降级 = 值控制711值 === 'no';
      仅走代理 = 值控制711值 === 'only';
      const 值控制710 = 获取配置文本值('dkby', 配置默认值.dkby, 本地值734.dkby || 本地值734.DKBY);
      禁用非传输层安全 = !!(值控制710 && 值控制710.toLowerCase() === 'yes');
      const 值控制709 = 获取配置文本值('yxby', 配置默认值.yxby, 本地值734.yxby || 本地值734.YXBY);
      禁用优选 = !!(值控制709 && 值控制709.toLowerCase() === 'yes');
      启用明文 = 获取配置开关值('ev', true, 本地值734.ev);
      启用木马