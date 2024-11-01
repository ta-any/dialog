let first_post = 'In fringilla eget quam ac porttitor. Sed hendrerit ultrices tincidunt. Quisque hendrerit pretium dui, vel ultricies ex fringilla nec. Aliquam eleifend pharetra dolor, eu malesuada libero imperdiet non. Nullam laoreet ullamcorper ipsum, in porttitor metus sagittis non. Cras porttitor placerat eros vel iaculis. Sed vel finibus nisl. Praesent in malesuada risus, sit amet venenatis nibh. Nulla luctus consequat erat nec lobortis. Suspendisse euismod maximus eros vel viverra. Curabitur non ullamcorper tortor. Pellentesque sagittis purus ac tristique ultricies. Cras eget molestie dolor. Morbi non tincidunt sem. '
let next_msg = 'Morbi congue ligula ut laoreet egestas!'
let list_msgs = ['Integer fringilla nisl sit amet ante varius mollis.',
		 'Nullam non quam ultrices, finibus magna eu, lacinia odio.', 
		 'Suspendisse ut lacus mollis, pharetra est et, cursus velit.', 
		 'Pellentesque mollis sem a tellus congue, at faucibus enim ornare.',
		 'Vestibulum vestibulum ex ut imperdiet ornare.']

class Dialog{
	Event_Log = [{data: '', event: '', txt: ''}]
	list_elements = ['circle', 'text']

	constructor(){
		this.Event_Log[0].data = new Date();
		this.Event_Log[0].event = 'start'
	}
	start(){
		this.render(first_post)
		setTimeout(() => this.render(next_msg), 1000)		

	}

	send_msg(){
		this.msg = input.value
		this.render(this.msg, 'user')

		input.value = ''
		input.focus()

		setTimeout(() => 
			this.render(list_msgs[Math.floor(0 + Math.random() * (4 + 1 - 0))]), 
				1500)
	}

	builder_block_msg(){
		if(this.msg.length <= 0 || /^\s+$/.test(this.msg)) return -1 

		let list = this.who != 'bot' ? this.list_elements.toReversed() : this.list_elements
		let block = document.createElement('div')
		
		for (let i = 0; i < 2; i++) {
			let DIV = document.createElement('div')
			DIV.classList.add(list[i])
			if(DIV.classList.contains('text')){
				DIV.textContent = this.msg
			} 
			block.appendChild(DIV)
		}
		block.classList.add('post')

		return block
	}

	render(msg, who = 'bot'){
		this.msg = msg
		this.who = who
		this.post = this.builder_block_msg()
		dialog.appendChild(this.post)

		this.record(new Date(), this.who + ' render', this.msg) 
	}

	record(data, event, txt){
		let log = {}
		log.data = data
		log.event = event
		log.txt = txt
		this.Event_Log.push(log)
	}
	get_log(){
		return this.Event_Log
	}

	get_msg(){
		if (this.who != 'bot') {
			return this.msg
		}
	}
}


const event = new Dialog()
event.start()

document.addEventListener( 'keyup', e => {
  if( e.code === 'Enter' ) event.send_msg();
});

send.addEventListener('click', (e) => {
	event.send_msg();
})

