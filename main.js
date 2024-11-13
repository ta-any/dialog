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

const assign_id = () => crypto.randomUUID() 

for(let node in memory){
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
		let node = new Builder(this.btm)
		context.appendChild(node.custom())
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
		} else if (this.output_info.includes(this.list[0])) {
			this.status += 'output'
		}
		const msg = this.list.slice(1)
		if(this.status == 'input'){
			this.record_in_memory(msg.join())
			return ['successfully!']

		} else if(this.status == 'output') {
			return [get_lst_timetable(today), this.status]
		} else {
			return ['have no idea']
		}
	}
	record_in_memory(msg){ 
		save_node(msg, today, this.list[0])

	}
}

class Builder{
	list_elements = ['circle', 'wraper_text_post']
	change_content = ['delete', 'edit'] 
	constructor(what, how){
		this.what = what
		this.how = how
	}
	create_DIV(){
		return document.createElement('div')
	}

	get_HTML(elements){
		const block = this.create_DIV()
		for (var i = 0; i < elements.length; i++) {
			let DIV = document.createElement('div')

			DIV.classList.add(elements[i])
			block.appendChild(DIV)
		}

		return block
	}

	msg(who){
		if(this.what.length <= 0 || /^\s+$/.test(this.what)) return -1 		
		let list = who != 'bot' ? this.list_elements.toReversed() : this.list_elements 

		let elements = [...this.get_HTML(list).childNodes]
		let block = this.create_DIV()
		elements.forEach((div, index) => {
			this.append_content(div, index)
			block.appendChild(div)
		})
		block.classList.add('post')

		return block
	}

	msg_with_footer(){
		let block = this.msg('bot')
		let footer = this.create_DIV()
		let change = this.create_DIV()
		let change_block = [...this.get_HTML(this.change_content).children]
		change_block.forEach((div, index) => {
			div.textContent = this.change_content[index]
			change.appendChild(div)
		})

		change.classList.add('change_content')
		footer.classList.add('footer_post')
		footer.appendChild(change)

		let wraper = block.querySelector('.wraper_text_post')

		wraper.appendChild(footer)
		return block
	}

	append_content(DIV, i, footer=false){ 
		if(DIV.classList.contains('wraper_text_post')){
			let text = this.create_DIV()
			text.innerText = this.what 			
			text.classList.add('text')
			DIV.style.width = '70%'
			if((i + 1) % 2 == 0){
				DIV.style.marginLeft = '40px'
				DIV.style.marginRight = '6em'
			} else {
				DIV.style.marginRight = '20px';
			DIV.style.marginLeft = '7.5em';
			}
		DIV.appendChild(text)
		}
	}

	custom(){
		const NODES = this.create_DIV()
		this.what.forEach(node => {
			let DIV = this.create_DIV()
			for(let index in node){
				DIV.textContent = node[index]
				DIV.classList.add('node')
				DIV.id = index
			}
			NODES.appendChild(DIV)
		})
		NODES.classList.add('nodes')
		NODES.setAttribute('id', 'nodes')
		return NODES
	}
}

class Dialog{
	Event_Log = [{data: '', event: '', txt: ''}]

	constructor(){
		this.Event_Log[0].data = new Date();
		this.Event_Log[0].event = 'start'

		this.builder_custom_btm() 	}
	start(){
		this.render(first_post)
		setTimeout(() => this.render(next_msg), 1000)		

	}

	send_msg(){
		this.msg = input.value
		this.render(this.msg, 'user')

		this.answer()			
	}

	answer(){
		const a = new Hub(this.msg) 		
		let [answer, status] = a.check()
		input.value = ''
		input.focus()

		setTimeout(() => this.render(answer, 'bot', status) , 1500)
	}

	render(msg, who = 'bot', status){ 		
		this.msg = msg
		this.who = who

		let post = new Builder(this.msg)
		
		if(status == 'output' && this.who == 'bot'){
			post = post.msg_with_footer() 		} 
		else {
			post = post.msg(this.who)
		}

		dialog.appendChild(post)

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

Object.assign(Dialog.prototype, Custom);

const overall = {
	text_msg(txt, element){
		let id = element.getAttribute('id')
		let first_index = txt.indexOf('...') + 1
		while(txt.includes('...')){
			let index = txt.indexOf('...')
			txt = txt.slice(0, index).concat(' ', txt.slice(index + 3, -1)) 
		}
		
		if(id == 'timetable'){ 			
			txt += 'today'
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

