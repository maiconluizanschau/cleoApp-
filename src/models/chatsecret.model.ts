export class Chatsecret {
    
        public $key: string;
    
        constructor(
            public inicioChat: any,
            public lastMessage: string,
            public timestamp: any,
            public title: string,
            public photo: string,
           // public maximoDias: any
        ) {}
    
    }