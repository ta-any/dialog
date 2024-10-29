console.log('Done/text...')
txt = 'Etiam facilisis in dui ac interdum. Praesent ullamcorper augue at diam placerat, tempor pharetra metus porta. Praesent pellentesque purus sit amet velit blandit eleifend. Praesent ultrices justo vitae nibh aliquam, quis tristique dolor ornare. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque mollis a velit et luctus. Suspendisse quis orci ut ipsum varius scelerisque. Duis volutpat nibh ac lacinia faucibus. Vivamus nec nisi sodales, vestibulum massa ac, euismod est. '

class Tmp_msg{
	constructor(txt, who = 'bot'){
		this.txt = txt
		this.who = who
	}
	get_value_txt(){
		console.log(this.txt)
		return this.txt
	}
	get_list_elements(){
		let list = ['circle', 'text']
		if(this.who == 'bot'){
			return list
		} else {
			return list.reverse()
		}
	}
	render(){
		let block = document.createElement('div')
		let list = this.get_list_elements()
		for (let i = 0; i < 2; i++) {
			let DIV = document.createElement('div')
			DIV.classList.add(list[i])
			if(DIV.classList.contains('text')){
				DIV.textContent = this.txt
			}
			block.appendChild(DIV)
		}
		
		block.classList.add('post')
		dialog.appendChild(block)
		
	}
	who(){

	}
}
tmp = new Tmp_msg(txt)
tmp.render()

function send_msg() {
	let txt = input.value
	
	user = new Tmp_msg(txt, 'user')
	user.render()
	user.get_value_txt()

	input.value = ''
	input.focus()
}

send.addEventListener('click', (event) => {
	send_msg()
})

document.addEventListener( 'keyup', event => {
  if( event.code === 'Enter' ) send_msg();
});
