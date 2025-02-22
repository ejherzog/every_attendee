const jsonPronounList = [
	["she", "her", "her", "hers", "herself"],
	["he", "him", "his", "his", "himself"],
	["they", "them", "their", "theirs", "themself"],
	["ze", "hir", "hir", "hirs", "hirself"],
	["ze", "zir", "zir", "zirs", "zirself"],
	["xey", "xem", "xyr", "xyrs", "xemself"],
	["ae", "aer", "aer", "aers", "aerself"],
	["e", "em", "eir", "eirs", "emself"],
	["ey", "em", "eir", "eirs", "eirself"],
	["fae", "faer", "faer", "faers", "faerself"],
	["fey", "fem", "feir", "feirs", "feirself"],
	["hu", "hum", "hus", "hus", "humself"],
	["it", "it", "its", "its", "itself"],
	["jee", "jem", "jeir", "jeirs", "jemself"],
	["kit", "kit", "kits", "kits", "kitself"],
	["ne", "nem", "nir", "nirs", "nemself"],
	["peh", "pehm", "peh's", "peh's", "pehself"],
	["per", "per", "per", "pers", "perself"],
	["sie", "hir", "hir", "hirs", "hirself"],
	["se", "sim", "ser", "sers", "serself"],
	["shi", "hir", "hir", "hirs", "hirself"],
	["si", "hyr", "hyr", "hyrs", "hyrself"],
	["they", "them", "their", "theirs", "themselves"],
	["thon", "thon", "thons", "thons", "thonself"],
	["ve", "ver", "vis", "vis", "verself"],
	["ve", "vem", "vir", "virs", "vemself"],
	["vi", "ver", "ver", "vers", "verself"],
	["vi", "vim", "vir", "virs", "vimself"],
	["vi", "vim", "vim", "vims", "vimself"],
	["xie", "xer", "xer", "xers", "xerself"],
	["xe", "xem", "xyr", "xyrs", "xemself"],
	["xey", "xem", "xeir", "xeirs", "xemself"],
	["yo", "yo", "yos", "yos", "yosself"],
	["ze", "zem", "zes", "zes", "zirself"],
	["ze", "mer", "zer", "zers", "zemself"],
	["zee", "zed", "zeta", "zetas", "zedself"],
	["zie", "zir", "zir", "zirs", "zirself"],
	["zie", "zem", "zes", "zes", "zirself"],
	["zie", "hir", "hir", "hirs", "hirself"],
	["zme", "zmyr", "zmyr", "zmyrs", "zmyrself"]
]

export class Pronouns {

    terms: {
        subject: string;
        object: string;
        determiner : string;
        possessive: string;
        reflexive: string;
    }

    constructor(terms: string[]) {
        this.terms = {
            subject: terms[0],
            object: terms[1],
            determiner: terms[2],
            possessive: terms[3],
            reflexive: terms[4]
        }
    }
}