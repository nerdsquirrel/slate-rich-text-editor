// function MarkHotkey(options) {    
//     const { type, key } = options;  ​
//     return {
//       onKeyDown(event, change) {
//         // Check that the key pressed matches our `key` option.
//         if (!event.ctrlKey || event.key != key) return
//   ​
//         // Prevent the default characters from being inserted.
//         event.preventDefault()
//   ​
//         // Toggle the mark `type`.
//         change.toggleMark(type)
//         return true
//       },
//     }
//   }

//   const HotKeyPlugins = [
//     new MarkHotkey({ key: 'b', type: 'bold' }),
//     new MarkHotkey({ key: '`', type: 'code' }),
//     new MarkHotkey({ key: 'i', type: 'italic' }),
//     new MarkHotkey({ key: 'u', type: 'underline' }),
//   ];

//   export default HotKeyPlugins;