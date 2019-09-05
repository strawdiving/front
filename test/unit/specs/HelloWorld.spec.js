// 导入Vue用于生成Vue实例
import Vue from 'vue'
// 导入组件
import HelloWorld from '@/components/HelloWorld'

// 测试脚本里应该包括一个或多个describe块，称为测试套件(test suite)
describe('HelloWorld.vue', () => {
  // 每个describe块应该包括一个或多个it块，称为测试用例(test case)
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld) // 获得HelloWorld组件实例
    const vm = new Constructor().$mount() // 将组件挂载到DOM上
    // 断言： DOM中class为hello的h1元素的文本内容为Welcome to Your Vue.js App
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
