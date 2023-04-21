// 随机生成十六进制颜色值
export const getRandomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
};

// 生成闭区间内随机整数
export const getRandomIntNumber = (min: number = 0, max: number = 0) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
