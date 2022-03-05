import Store from 'electron-store';
const store = new Store()

// 写数据
export const write_data = (path: string, data: any) => {
  store.set(path, data);
  // console.log(`将${data}写入${path}`);
}
// 读数据
export const read_data = <T>(path: string): T => {
  let data: T = store.get(path) as T;
  // console.log(`${path}存储的数据为${data}`);
  return data
}

// 检测路径
export const has_data = (path: string) => {
  let has = store.has(path)
  console.log(`路径${path}${has ? '' : '不'}存在`)
  return store.has(path)
}

// 删除路径
export const delete_data = (path: string) => {
  store.delete(path);
  console.log(`删除${path}成功`)
}