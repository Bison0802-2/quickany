const buildKey = (appName: string, title: string) => {
  return `${appName}/${title}`
}


export default buildKey;