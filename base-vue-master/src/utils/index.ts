export const noop = () => {}
/**
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 * Date()).pattern('yyyy-MM-dd hh:mm:ss.S')==> 2006-07-02 08:09:04.423
 * (new Date()).pattern('yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern('yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern('yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern('yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 */
export const dateFormat = (val: any, fmt: string) => {
  if (!val || !fmt) {
    return val
  }
  const date: any = new Date(
    /^\d+(\.\d{2})?$/.test(val)
      ? new Date(parseInt(val))
      : new Date(val.replace(/[-]/g, '/')).getTime()
  )
  const o: any = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  const week: any = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/** 引入第三方js插件 */
export const loadJs = (isExsit, url: string, callback = noop): void => {
  if (isExsit) { return callback() }
  const script: any = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  if (Object.prototype.toString.call(callback) === '[object Function]') {
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          callback()
        }
      }
    } else {
      script.onload = callback
    }
  }
  script.src = url
  document.body.appendChild(script)
}

/** 拨打电话 */
export const callPhone = (tel: string) => {
  const ele = document.createElement('a')
  ele.href = `tel:${tel}`
  document.body.appendChild(ele)
  ele.click()
  document.body.removeChild(ele)
}

export const toPercent = (floa: number) => {
  if (!floa) return 0
  return parseInt(String(Number(floa) * 100), 10)
}

export const getCookie = (key: string) => {
  const cookies = document.cookie
    .split(';')
    .map(v => v.trim().split('='))
    .reduce((p, [k, v]) => ({
      ...p,
      [k]: v
    }), {})
  return cookies[key] || ''
}
/**
 * 查询字符串 -> 对象
 * '?name=woody&age=18' -> {name:'woody', age:'18'}
 */
export const hashToQuery = () => {
  const search = window.location.hash.split('?')[1]
  if (!search) return {}
  return search
    .split('&')
    .map(s => {
      const exec = /^(\w+)=(.{0,})/.exec(s)
      return exec ? exec.slice(1, 3) : []
    })
    .reduce((p: any, [k, v]) => ({ ...p, [k]: v }), {})
}
