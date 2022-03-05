

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
export function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
  .app-loading-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0);
    z-index: 9;
  }
  .wrapper {
    width: 200px;
    margin: 200px auto;
    perspective:1000px;
}
.wrapper .cube{
    width: 200px;
    height: 200px;
    position: relative;
    /*设置3d环境*/
    transform-style:preserve-3d;
    transform: rotateX(-50deg) rotateY(-50px) ;
    animation: transform 8s linear infinite;
}
@keyframes transform{
    0%{
        transform:rotateX(0) rotateY(0) rotateZ(0);
    }
    100% {
        transform:rotateX(720deg) rotateY(360deg) rotateZ(360deg);
    }
}
.cube>div{
    width: 100%;
    height: 100%;
    border: 10px solid #66daff;
    border-radius: 20px;
    position: absolute;
    top: 0;
    color:#ff92ff;
    font-size: 36px;
    font-weight: 100;
    text-align:center;
    line-height: 200px;
    background-color: rgba(51,51,51,.3);
}
.out-front {
    transform: translateZ(100px);

} 
.out-back {
    transform:  translateZ(-100px);
}
.out-left{
    transform: translateX(-100px) rotateY(-90deg);
}
.out-right{
    transform: translateX(100px) rotateY(90deg);
}
.out-top{
    transform: translateY(-100px) rotateX(90deg);
}
.out-bottom {
    transform: translateY(100px) rotateX(-90deg);
}
 
.cube>span{
    display: block;
    width: 90px;
    height: 90px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -45px;
    margin-left: -45px;
    border: 5px solid #424242;
    border-radius: 30%;
    background-color : #ffe7f9;
    opacity: 0.7;
}
.in-front{
    transform: translateZ(45px);
    justify-content: center;
    align-items:center;
}
.in-back {
    transform:translateZ(-45px) ;
}
.in-left{
    transform: translateX(-45px) rotateY(-90deg);
}
.in-right{
    transform: translateX(45px) rotateY(90deg);
}
.in-top{
    transform: translateY(-45px) rotateX(90deg);
}
.in-bottom{
    transform: translateY(45px) rotateX(-90deg);
}
.points{
    display: block;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin:5px;
    background-color: #bb9aff;   
}
/* 为1点的父盒子设置 */
span.in-front{
    display: flex;
    justify-content: center;
    align-items: center;
}
.in-front>span {
    width: 40px;
    height: 40px;
}
/* 为2点的盒子设置 */
span.in-left{
    display: flex;
    justify-content:center;
}
span.in-left>.pitL2{
    align-self: flex-end;
}
.in-left>span,.in-right>span{
    width: 25px;                 /*2点和4点都是排横纵两排，所有设置一样大小*/
    height: 25px;
    margin: 10px;
}
/* 设置3点的盒子 */
span.in-back{
    display: flex;
}
.in-back .pitB2{
    align-self:center;
}
.in-back .pitB3{
    align-self:flex-end;
}
/* 设置4点的盒子 */
span.in-right{
    display:flex;
    /* 不设置对齐方式，默认为主轴对齐 */
    /* 换行 */
    flex-wrap:wrap;
}
/* 设置5点的盒子 */
span.in-top{
    display:flex;
}
.in-top .pitT1,
.in-top .pitT3{
    display: flex;
    flex-direction: column;
     justify-content: space-between;
}
.in-top .pitT2{
   display:flex;
   align-self: center;
}
/* 设置6点的盒子 */
span.in-bottom{
    display: flex;
    flex-wrap:wrap;
    align-content:space-around;    
}
.cube:hover .out-front {
    transform: translateZ(200px);

} 
.cube:hover  .out-back {
    transform:  translateZ(-200px);
}
.cube:hover  .out-left{
    transform: translateX(-200px) rotateY(-90deg);
}
.cube:hover .out-right{
    transform: translateX(200px) rotateY(90deg);
}
.cube:hover .out-top{
    transform: translateY(-200px) rotateX(90deg);
}
.cube:hover .out-bottom {
    transform: translateY(200px) rotateX(-90deg);
}`
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="wrapper">
  <div class="cube">
      <div class="out-front"></div>
      <div class="out-back"></div>
      <div class="out-left"></div>
      <div class="out-right"></div>
      <div class="out-top"></div>
      <div class="out-bottom"></div>
      <span class="in-front">
          <span class="points"></span>
      </span>
      <span class="in-back">
          <span class="points"></span>
          <span class="points pitB2"></span>
          <span class="points pitB3"></span>
      </span>
      <span class="in-left">
          <span class="points"></span>
          <span class="points pitL2"></span>
      </span>
      <span class="in-right">
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
      </span>
      <span class="in-top">
          <span class="pitT1">
              <span class="points"></span>
              <span class="points"></span>
          </span>
          <span class="pitT2">
              <span class="points"></span>
          </span>
          <span class="pitT3">
              <span class="points"> </span>
              <span class="points"></span>
          </span>
      </span>
      <span class="in-bottom">
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
          <span class="points"></span>
      </span>
  </div>
</div>`

  return {
    appendLoading() {
      document.head.appendChild(oStyle)
      document.body.appendChild(oDiv)
    },
    removeLoading() {
      document.head.removeChild(oStyle)
      document.body.removeChild(oDiv)
    },
  }
}
