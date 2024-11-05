let first_post = 'In fringilla eget quam ac porttitor. Sed hendrerit ultrices tincidunt. Quisque hendrerit pretium dui, vel ultricies ex fringilla nec. Aliquam eleifend pharetra dolor, eu malesuada libero imperdiet non. Nullam laoreet ullamcorper ipsum, in porttitor metus sagittis non. Cras porttitor placerat eros vel iaculis. Sed vel finibus nisl. Praesent in malesuada risus, sit amet venenatis nibh. Nulla luctus consequat erat nec lobortis. Suspendisse euismod maximus eros vel viverra. Curabitur non ullamcorper tortor. Pellentesque sagittis purus ac tristique ultricies. Cras eget molestie dolor. Morbi non tincidunt sem. '
let next_msg = 'Morbi congue ligula ut laoreet egestas!'

input.value = ''
input.focus()


const memory = {
	'8d10c5fa-d3be-43fc-8760-466eadb1389f' : {data: '2024-11-01', txt: 'In fermentum lectus a commodo fermentum.'},
	'97f79f84-4358-4d82-be16-983c7aaccc66' : {data: '2024-11-01', txt: 'Cras aliquam arcu sed dui condimentum, venenatis tincidunt risus sodales.'},
	'e3075377-5975-421e-a62e-876fc718136f' : {data: '2024-11-01', txt: 'Maecenas venenatis ex lacinia enim ultrices rutrum.'},
	'11ae2d1a-e720-48f0-b878-6886c4cf1e7d' : {data: '2024-10-28', txt: 'Fusce nec urna quis nisi bibendum cursus a id sem.'},
	'477a7975-9bc4-4cb6-8a26-96472ceb06bf' : {data: '2024-11-05', txt: 'TODAY! Vestibulum dapibus enim ut viverra feugiat.'}
}
for(let node in memory){
	let value = JSON.stringify(memory[node])
	localStorage.setItem(node, value);
}

const day = new Date()
const current_year = day.getFullYear()
const today = day.toISOString().split('T')[0]

function get_lst_timetable(day) {
	let timetable = ''
	for(let line in localStorage){
		if (!localStorage.hasOwnProperty(line)) continue;	
		let node = JSON.parse(localStorage.getItem(line))
		if(node.data == day) {
			timetable += node.txt + '\n'
		} 
	}	
	if (timetable == '') {timetable += 'Nothing!'}
	return timetable
}

 

const assign_id = () => crypto.randomUUID()

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

		setTimeout(() => this.answer() , 1500)
			
	}

	answer(){
		this.render(get_lst_timetable(today)) 
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

		this.record(new Date(), this.who + ' render', this.msg) 	}

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

const overall = {
	text_msg(txt, element){
		let id = element.getAttribute('id')
		let first_index = txt.indexOf('...') + 1
		while(txt.includes('...')){
			let index = txt.indexOf('...')
			txt = txt.slice(0, index).concat(' ', txt.slice(index + 3, -1)) 
		}
		
		if(id == 'timetable'){ 			txt += 'today'
			this.append_focus(txt, [first_index, first_index + 5])
		} else {
			this.append_focus(txt, [first_index, first_index])
		}

		
	},
	append_focus(txt, [start, end]){
		input.value = txt
		input.focus()
		input.setSelectionRange(start, end)
		
	},
}


const event = new Dialog()
event.start()

document.addEventListener( 'keyup', e => {
  if( e.code === 'Enter' ) event.send_msg();
});

send.addEventListener('click', (e) => {
	event.send_msg();
})

nodes.addEventListener('click', (e) => {
	overall.text_msg(e.target.textContent, e.target)
	
})

