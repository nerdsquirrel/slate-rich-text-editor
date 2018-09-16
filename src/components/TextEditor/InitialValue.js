import { Value } from 'slate';
import LocalStorageService from '../../services/LocalStorageService';
import AppConstant from '../../constants/AppConstants';

const existingValue = LocalStorageService.get(AppConstant.LOCALSTORAGEKEY.CONTENT);
const initialValue = Value.fromJSON( existingValue || {
	document: {
		nodes: [
			{
				object: 'block',
				type: 'paragraph',
				nodes: [
					{
						object: 'text',
						leaves: [
							{
								text: 'A line of text in a paragraph.',
							},
						],
					},
				],
			},
		],
	},
});

// const initialValue = Value.fromJS({
//     "document": {
//       "nodes": [
//         {
//           "object": "block",
//           "type": "paragraph",
//           "nodes": [
//             {
//               "object": "text",
//               "leaves": [
//                 {
//                   "text": "This is editable "
//                 },
//                 {
//                   "text": "rich",
//                   "marks": [
//                     {
//                       "type": "bold"
//                     }
//                   ]
//                 },
//                 {
//                   "text": " text, "
//                 },
//                 {
//                   "text": "much",
//                   "marks": [
//                     {
//                       "type": "italic"
//                     }
//                   ]
//                 },
//                 {
//                   "text": " better than a "
//                 },
//                 {
//                   "text": "<textarea>",
//                   "marks": [
//                     {
//                       "type": "code"
//                     }
//                   ]
//                 },
//                 {
//                   "text": "!"
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           "object": "block",
//           "type": "paragraph",
//           "nodes": [
//             {
//               "object": "text",
//               "leaves": [
//                 {
//                   "text":
//                     "Since it's rich text, you can do things like turn a selection of text "
//                 },
//                 {
//                   "text": "bold",
//                   "marks": [
//                     {
//                       "type": "bold"
//                     }
//                   ]
//                 },
//                 {
//                   "text":
//                     ", or add a semantically rendered block quote in the middle of the page, like this:"
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           "object": "block",
//           "type": "block-quote",
//           "nodes": [
//             {
//               "object": "text",
//               "leaves": [
//                 {
//                   "text": "A wise quote."
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           "object": "block",
//           "type": "paragraph",
//           "nodes": [
//             {
//               "object": "text",
//               "leaves": [
//                 {
//                   "text": "Try it out for yourself!"
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   }
//   )

export default initialValue;
