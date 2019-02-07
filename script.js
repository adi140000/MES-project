const buttonStart = document.querySelector(".btn");
const data = document.querySelector(".data");
const S = document.querySelector(".data #s strong");
const K = document.querySelector(".data #k strong");
const L = document.querySelector(".data #l strong");
const alfa = document.querySelector(".data #alfa strong");
const T = document.querySelector(".data #t strong");
const q = document.querySelector(".data #q strong");
const nh = document.querySelector(".data #nh strong");
const divCal = document.querySelector(".cal");

const url = "data.json";

const GlobalData = {};
const nodeArray = [];
const elementArray = [];
const PG = [];
const HG = [];
const TG = [0, 0, 0];

const downloadDate = () => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            S.innerHTML = data.S;
            K.innerHTML = data.K;
            L.innerHTML = data.L;
            alfa.innerHTML = data.alfa;
            T.innerHTML = data.T;
            q.innerHTML = data.q;
            nh.innerHTML = data.nh;

            GlobalData.S = data.S;
            GlobalData.K = data.K;
            GlobalData.L = data.L;
            GlobalData.alfa = data.alfa;
            GlobalData.T = data.T;
            GlobalData.q = data.q;
            GlobalData.nh = data.nh;
        });

    const calculate = document.createElement("button");
    calculate.textContent = "Calculate";
    divCal.appendChild(calculate);
    calculate.classList.add("calculate");
    calculate.addEventListener("click", () => {
        fillNode();
        fillElemet();
        generatePG();
        generateHG();
        calculateTG();

    });
    buttonStart.removeEventListener("click", downloadDate);
};

const fillNode = () => {
    nodeArray.length = 0;
    for (let i = 0; i < GlobalData.nh + 1; i++) {
        const temp = {};
        temp.x = (GlobalData.L / GlobalData.nh) * i;
        if (i === 0) {
            temp.BC = 1;
        } else if (i === GlobalData.nh) {
            temp.BC = 2;
        } else {
            temp.BC = 0;
        }
        nodeArray.push(temp);
    }
};

const fillElemet = () => {
    elementArray.length = 0;
    for (let i = 0; i < GlobalData.nh; i++) {
        const temp = {};
        temp.S = GlobalData.S;
        temp.K = GlobalData.K;
        temp.L = GlobalData.L;
        temp.q = GlobalData.q;

        ///macierz lokalna
        const array = [];
        for (let j = 0; j < 2; j++) {
            array[j] = [];
        }

        array[0][0] = (temp.S * temp.K) / (temp.L / GlobalData.nh);
        array[0][1] = -((temp.S * temp.K) / (temp.L / GlobalData.nh));
        array[1][0] = -((temp.S * temp.K) / (temp.L / GlobalData.nh));
        if (i < GlobalData.nh - 1) {
            array[1][1] = (temp.S * temp.K) / (temp.L / GlobalData.nh);
        } else {
            array[1][1] =
                (temp.S * temp.K) / (temp.L / GlobalData.nh) + GlobalData.alfa * temp.S;
        }

        temp.HL = array;

        /// wektor obciazen
        temp.PL = [];
        if (i === 0) {
            temp.PL[0] = GlobalData.q * temp.S;
            temp.PL[1] = 0;
        } else if (i < GlobalData.nh - 1) {
            temp.PL[0] = 0;
            temp.PL[1] = 0;
        } else {
            temp.PL[0] = 0;
            temp.PL[1] = -(GlobalData.alfa * GlobalData.T * temp.S);
        }

        elementArray.push(temp);
    }
};

const generatePG = () => {
    PG.length = 0;
    for (let i = 0; i <= GlobalData.nh; i++) {
        PG.push(0);
    }


    let helper = 0;
    while (helper < GlobalData.nh) {
        for (let i = 0; i < GlobalData.nh; i++) {
            PG[helper] = +elementArray[i].PL[0];
            helper++;
            PG[helper] = +elementArray[i].PL[1];
        }
    }
    console.log(PG);
};

const generateHG = () => {
    HG.length = 0;
    for (let i = 0; i <= GlobalData.nh; i++) {
        HG[i] = [];
    }

    for (let i = 0; i <= GlobalData.nh; i++) {
        for (let j = 0; j <= GlobalData.nh; j++) {
            HG[i][j] = 0;
        }
    }
    

    GenerateGlobalMatrix(GlobalData,HG,elementArray);
    console.log(HG) ;  

};

const calculateTG = () => {

    for (let i = 0; i < GlobalData.nh; i++) {
        for (let j = i + 1; j < GlobalData.nh + 1; j++)
            HG[j][i] /= HG[i][i];


        for (let j = i + 1; j < GlobalData.nh + 1; j++)
            for (let f = i + 1; f < GlobalData.nh + 1; f++)
                HG[j][f] -= HG[j][i] * HG[i][f];
    }

    let helper;
    TG[0] = PG[0];

    for (let i = 1; i < GlobalData.nh + 1; i++) {
        helper = 0;
        for (let j = 0; j < i; j++)
            helper += HG[i][j] * TG[j];
        TG[i] = PG[i] - helper;

    }

    TG[GlobalData.nh] /= HG[GlobalData.nh][GlobalData.nh];


    for (let i = GlobalData.nh - 1; i >= 0; i--) {
        let tempp = 0;
        for (let j = i + 1; j < GlobalData.nh + 1; j++) {
            tempp += HG[i][j] * TG[j];
        }
        TG[i] = (TG[i] - tempp) / HG[i][i];
    }

    TG.forEach((item,i)=>TG[i]=item*-1)
    document.querySelector(".Temperature").innerHTML=TG;
}

const GenerateGlobalMatrix=(data,Matrix,elements)=>{
    for (let i = 0; i <= data.nh; i++) {

        if (i === 0) {
            Matrix[i][i] = elements[i].HL[0][0];
            Matrix[i][i + 1] = elements[i].HL[0][1];
        } else if (i === data.nh) {
            Matrix[i][i - 1] = elements[i - 1].HL[1][0];
            Matrix[i][i] = elements[i - 1].HL[1][1];
        } else {
            Matrix[i][i - 1] = elements[i - 1].HL[1][0];
            Matrix[i][i] = elements[i - 1].HL[1][1] + elementArray[i].HL[0][0];
            Matrix[i][i + 1] = elements[i].HL[0][1];
        }


    }
}
buttonStart.addEventListener("click", downloadDate);