// import EasySpeech from 'easy-speech'
// let isEasySpeechInit = false;
// export default async function textToVoice(text) {
//     if(!EasySpeech.detect()) {
//         return;
//     }
//     try {
//         if(isEasySpeechInit === false) {
//             await EasySpeech.init({maxTimeout: 5000, interval: 250});
//             isEasySpeechInit = true;
//         }
//         await EasySpeech.speak({
//             text: text,
//             //voice: myLangVoice, // optional, will use a default or fallback
//             pitch: 1,
//             rate: 1,
//             volume: 1,
//             // there are more events, see the API for supported events
//             boundary: e => console.debug('boundary reached')
//           })
//     }
//     catch(err) {
//         console.error(`textToVoice js`, err);
//     }
// }
import { TextToSpeech } from '@capacitor-community/text-to-speech';
export default async function textToVoice(text) {
    try {
        await TextToSpeech.speak({
            text: text,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
          });
    } catch (error) {
        console.log("🚀 ~ file: textToVoice.js:38 ~ textToVoice ~ error:", error)
        
    }

}