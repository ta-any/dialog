localStorage.clear(); 
let first_post = 'In fringilla eget quam ac porttitor. Sed hendrerit ultrices tincidunt. Quisque hendrerit pretium dui, vel ultricies ex fringilla nec. Proin dolor diam, hendrerit vitae quam non, accumsan rutrum nunc. In mauris metus, congue a eros sed, placerat lacinia urna. Duis a dolor eu elit commodo porta non in est. '
let next_msg = 'Morbi congue ligula ut laoreet egestas!'
let list_msgs = ['Integer fringilla nisl sit amet ante varius mollis.',
								 'Nullam non quam ultrices, lacinia odio.', 
								 'Suspendisse ut lacus mollis, pharetra est et, cursus velit.', 
								 'Pellentesque at faucibus enim ornare.',
								 'Vestibulum vestibulum ex ut imperdiet ornare.']

input.value = ''
input.focus()

const day = new Date()
const current_year = day.getFullYear()
const today = day.toISOString().split('T')[0]


const memory = {
	'8d10c5fa-d3be-43fc-8760-466eadb1389f' : {data: '2024-11-01', txt: 'In fermentum lectus a commodo fermentum.'},
	'97f79f84-4358-4d82-be16-983c7aaccc66' : {data: '2024-11-01', txt: 'Cras aliquam arcu sed dui condimentum, venenatis tincidunt risus sodales.'},
	'e3075377-5975-421e-a62e-876fc718136f' : {data: '2024-11-01', txt: 'Maecenas venenatis ex lacinia enim ultrices rutrum.'},
	'11ae2d1a-e720-48f0-b878-6886c4cf1e7d' : {data: '2024-10-28', txt: 'Fusce nec urna quis nisi bibendum cursus a id sem.'},
	'477a7975-9bc4-4cb6-8a26-96472ceb06bf' : {data: '2024-11-06', txt: 'TODAY! Vestibulum dapibus enim ut viverra feugiat.'}
}

const assign_id = () => crypto.randomUUID() for(let node in memory){
	let value = JSON.stringify(memory[node])
	localStorage.setItem(node, value);
}

for(let node in list_msgs){
	save_node(list_msgs[node], today, 'timetable')
}

function save_node(node, data, tag) {
	let form_node = Object.create( {  
    data: '', 
    txt: '', 
    tag: '',
	});
	form_node.txt = node
	form_node.data = data
	form_node.tag = tag
	let value = JSON.stringify(form_node)
	let ID = assign_id()
	localStorage.setItem(ID, value);
}

function get_lst_timetable(day) {
	let timetable = ''
	let count = 1
	for(let line in localStorage){
		if (!localStorage.hasOwnProperty(line)) continue;	
		let node = JSON.parse(localStorage.getItem(line))
		if(node.data == day) {
			timetable += (count) + '. ' + node.txt + '\n'
			count += 1
		} 
		
	}	
	if (timetable == '') {timetable += 'Nothing!'}
	return timetable
}

const Custom = {
	btm: [{buy : 'buy...'}, {scheduled : 'scheduled to... in...'}, {timetable : 'timetable...'}],

	builder_custom_btm(){	
		this.btm.forEach(node => {
			let DIV = document.createElement('div')
			for(let index in node){
				DIV.textContent = node[index]
				DIV.classList.add('node')
				DIV.id = index
			}
			nodes.appendChild(DIV)

		})
	},
}

class Hub {
	input_info = ['buy', 'scheduled']
	output_info = ['timetable']
	status = ''
	constructor(view){
		this.view = view
		this.list = this.view.split(' ')	
	}
	check(){
		if( this.input_info.includes(this.list[0]) ){
			this.status += 'input'
		} else {
			this.status += 'output'
		}
		const msg = this.list.slice(1)
		if(this.status == 'input'){
			this.record_in_memory(msg.join())
			return 'successfully!'
		} else {
			return get_lst_timetable(today)
		}
	}
	record_in_memory(msg){ 
		save_node(msg, today, this.list[0])

	}
}

class Dialog{
	Event_Log = [{data: '', event: '', txt: ''}]
	list_elements = ['circle', 'text']

	constructor(){
		this.Event_Log[0].data = new Date();
		this.Event_Log[0].event = 'start'

		this.builder_custom_btm()
	}
	start(){
		this.render(first_post)
		setTimeout(() => this.render(next_msg), 1000)		

	}

	send_msg(){
		this.msg = input.value
		this.render(this.msg, 'user')
		const a = new Hub(this.msg) 		let answer = a.check()

		input.value = ''
		input.focus()

		setTimeout(() => this.render(answer) , 1500)
			
	}

	answer(){
		if(this.msg.includes('today')){
			this.render(get_lst_timetable(today)) 
		} else {
			this.render('have no idea') 
		}
	}

	builder_block_msg(){
		if(this.msg.length <= 0 || /^\s+$/.test(this.msg)) return -1 
		let list = this.who != 'bot' ? this.list_elements.toReversed() : this.list_elements
		let block = document.createElement('div')
		
		for (let i = 0; i < 2; i++) {
			let DIV = document.createElement('div')
			DIV.classList.add(list[i])
			if(DIV.classList.contains('text')){
				DIV.innerText = this.msg 				if((i + 1) % 2 == 0){
					DIV.style.marginLeft = '40px'
					DIV.style.marginRight = '6em'
				} else {
					DIV.style.marginRight = '20px';
  				DIV.style.marginLeft = '7.5em';
				}
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

Object.assign(Dialog.prototype, Custom);

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

