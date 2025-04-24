const options=document.querySelectorAll('.option');
const data_sections=document.querySelectorAll('.data');

options.forEach(option => {
    option.addEventListener('click', function(){
        if(this.querySelector('b')) return;

        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        data_sections.forEach(section => {
            section.classList.remove('active');
            section.style.display='none';
        });

        const target_id=this.dataset.target;
        const target=document.getElementById(target_id);
        if(target){
            target.style.display='block';
            void target.offsetWidth;
            target.classList.add('active');
        }
    });
});

const initial_targ=document.querySelector('.option.selected')?.dataset.target;
if(initial_targ){
    const initial_sec=document.getElementById(initial_targ);
    if(initial_sec){
        initial_sec.style.display='block';
        initial_sec.classList.add('active');
    }
}
