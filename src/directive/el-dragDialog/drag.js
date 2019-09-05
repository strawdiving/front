export default{
  // el:指令所绑定的元素，可以用来直接操作DOM; vnode: Vue编译生成的虚拟节点
  bind(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      // dialogHeaderEl.offsetLeft和offsetTop都为0
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 元素content+padding+border 的宽度和高度
      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      // 浏览器视口的大小
      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      // 元素左上角相对于父元素左边界的偏移值
      const minDragDomLeft = dragDom.offsetLeft
      // 元素框右边界的最大可拖拽距离
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      // 元素左上角相对于父元素上边界的偏移值
      const minDragDomTop = dragDom.offsetTop
      // 元素框下边界的最大可拖拽距离
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

      // 获取到的值带px 正则匹配替换，元素左/上边界与包含块左/上边界的偏移值
      let styL = getStyle(dragDom, 'left')
      let styT = getStyle(dragDom, 'top')

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        // 向左移动
        if (-(left) > minDragDomLeft) {
          left = -minDragDomLeft
          // 向右移动
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }
        // 向上移动
        if (-(top) > minDragDomTop) {
          top = -minDragDomTop
          // 向下移动
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

        // emit onDrag event
        vnode.child.$emit('dragDialog')
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
