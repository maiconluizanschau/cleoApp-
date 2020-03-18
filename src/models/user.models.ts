export class User {


    public $key: string;
    public sobre: string;
    public local: string;
    public genero: string;
    public dataNasc: string;   
    public idade: number;

    constructor(
        public name: string,
        public sobrenome: string,
        public email: string,
        public photo: string,
        public key: string,

    ) {


    }

    //FAZ CALCULO DA IDADE PARA ARMAZENAR NO BANCO ---> PROBLEMA REVISAR CALCULO <----
    public calculoIdade(data_nasc: string): number {
        var birthday = +new Date(data_nasc);
        return ~~((Date.now() - birthday) / (31557600000));

    }

}

