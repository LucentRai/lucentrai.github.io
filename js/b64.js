const {hash} = window.location;
const decodedMessage = document.querySelector('#decoded'),
	btnDecode = document.querySelector('#btn-decode'),
	btnEncode = document.querySelector('#btn-encode');

if(hash){
	decodedMessage.innerText = atob(hash.replace('#', ''));
}

btnDecode.addEventListener('click', e => {
	e.preventDefault();

	const messageToDecode = document.querySelector('#decode-message');

	decodedMessage.innerText = atob(messageToDecode.value);
});
btnEncode.addEventListener('click', e => {
	e.preventDefault();

	const message = document.querySelector('#message');
	const encoded = document.querySelector('#encoded');

	encoded.value = btoa(message.value);
	encoded.select();
});