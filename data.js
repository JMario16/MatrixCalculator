function matrix_latex(matrix){
    let latex='\\[\\begin{bmatrix}';
    for(let i=0; i<matrix.length; i++){
        latex+=matrix[i].join(' & ');
        if(i!==matrix.length-1) latex+=' \\\\ ';
    }
    latex+='\\end{bmatrix}\\]';
    return latex;
}

function sum_subs(n){
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('.box_1 textarea');
    const rows= n===1 ? parseInt(inputs[0].value) : parseInt(inputs[2].value);
    const cols= n===1 ? parseInt(inputs[1].value) : parseInt(inputs[3].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    function create_table(nclass){
        const table=document.createElement('div');
        table.className=nclass;
        for(let i=0; i<rows; i++){
            const row=document.createElement('div');
            row.className='text_table';
            for(let j=0; j<cols; j++){
                const cell=document.createElement('textarea');
                cell.rows=1;
                cell.cols=3;
                cell.style.margin='0.3rem';
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    let matrixA=[];
    const tableA=create_table('matrixA');
    const following_button=document.createElement('button');
    following_button.innerText='Siguiente';
    following_button.className='button';
    following_button.onclick=() => show_following();
    
    let matrixB=[];
    const tableB=create_table('matrixB');
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_sumsub();

    container.appendChild(tableA);
    container.appendChild(following_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function show_following(){
        matrixA=read_matrix(tableA);
        if(!matrixA){
            alert('Ningun espacio puede quedar vacio.');
            return;
        }

        container.innerHTML='';
        container.appendChild(tableB);
        container.appendChild(calc_button);
    }

    function read_matrix(table){
        const rows_divs=table.querySelectorAll('.text_table');
        const matrix=[];
        for(let row of rows_divs){
            const values=[];
            const cols_divs=row.querySelectorAll('textarea');
            for(let col of cols_divs){
                const val=parseFloat(col.value);
                if(isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

    function calculate_sumsub(){
        matrixB=read_matrix(tableB);
        if(!matrixB){
            alert('Ningún espacio puede quedar vacio.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const matrixS=[];
        for(let i=0;  i<rows; i++){
            const values=[];
            for(let j=0; j<cols; j++){
                if(n==1){
                    values.push(matrixA[i][j]+matrixB[i][j]);
                }else{
                    values.push(matrixA[i][j]-matrixB[i][j]);
                }
                
            }
            matrixS.push(values);
        }

        const result= n===1 ? document.getElementById('sum') : document.getElementById('subs');
        const symbol= n===1 ? '+' : '-';
        result.innerHTML='';
        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ B = ${matrix_latex(matrixB).slice(2, -2)} \\]
            \\[ A ${symbol} B = ${matrix_latex(matrixS).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
    }
}