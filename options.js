const options=document.querySelectorAll('.option');
const dataSections=document.querySelectorAll('.data');

options.forEach(option => {
    option.addEventListener('click', function(){
        if(this.querySelector('b')) return;

        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        dataSections.forEach(section => section.classList.remove('active'));

        const targetId=this.dataset.target;
        const targetElement=document.getElementById(targetId);
        if(targetElement) targetElement.classList.add('active');
    });
});

const initialTarget=document.querySelector('.option.selected')?.dataset.target;
if(initialTarget){
    const initialSection=document.getElementById(initialTarget);
    if(initialSection) initialSection.classList.add('active');
}