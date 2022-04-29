// jsx 在vue3中的使用

import { defineComponent, ref, useSlots, withModifiers } from 'vue'

//一、函数组件
// export default Text = () => <div>test jsx</div>

//二、defineComponent
// export default defineComponent({
//   render() {
//     return <div>二、defineComponent</div>
//   }
// })

//三、defineComponent({setup(){}})
//摒弃this、对ts支持最好
//vue中的jsx 借助了babel-plugin-jsx
//vue中独特的概念 修饰符、slot、dreactive、emit
export default defineComponent({
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  },
  setup() {
    const counter = ref(0)
    const list = ref<number[]>([])
    const add = () => {
      counter.value++
      list.value.push(counter.value)
    }
    const solt = useSlots()
    // const isood = computed(()=>counter.value%2)
    return () => {
      // 代替 v-for
      const jo = counter.value % 2 ? <span> odd</span> : <span> even</span>
      return (
        <div>
          <p class="font-mono text-indigo-600">
            <span onClick={withModifiers(add, ['self'])}>Fuck me</span>:{' '}
            {counter.value} second
          </p>
          <input type="number" v-focus v-model={counter.value} class="ring-2" />
          <div>
            <p class="font-sans text-light-blue-600"> Fuck me second is</p>
            <p class="font-sans text-light-blue-600 ">{jo}</p>
          </div>
          <div>
            {list.value.map((val: number) => (
              <p key={val}>{val}</p>
            ))}
          </div>
          {solt.slot1 && solt.slot1()}
          {solt.slot2 && solt.slot2()}
        </div>
      )
    }
  }
})
