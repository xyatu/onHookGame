import { math } from "cc";

export var enemy_data = {
    "90001": { "ID": 90001, "name": "怪物1", "attack": 50, "quickness": 10, "hit": 12, "crit": 20, "defense": 10, "hp": 5000, "dodge": 10, "tenacity": 10, "attackSpeed": 1, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90002": { "ID": 90002, "name": "怪物2", "attack": 100, "quickness": 12, "hit": 14, "crit": 22, "defense": 11, "hp": 10000, "dodge": 11, "tenacity": 11, "attackSpeed": 0.99, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90003": { "ID": 90003, "name": "怪物3", "attack": 100, "quickness": 14, "hit": 16, "crit": 24, "defense": 12, "hp": 15000, "dodge": 12, "tenacity": 12, "attackSpeed": 0.98, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90004": { "ID": 90004, "name": "怪物4", "attack": 100, "quickness": 16, "hit": 18, "crit": 26, "defense": 13, "hp": 20000, "dodge": 13, "tenacity": 13, "attackSpeed": 0.97, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90005": { "ID": 90005, "name": "怪物5", "attack": 100, "quickness": 18, "hit": 20, "crit": 28, "defense": 14, "hp": 25000, "dodge": 14, "tenacity": 14, "attackSpeed": 0.96, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90006": { "ID": 90006, "name": "怪物6", "attack": 100, "quickness": 20, "hit": 22, "crit": 30, "defense": 15, "hp": 30000, "dodge": 15, "tenacity": 15, "attackSpeed": 0.95, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90007": { "ID": 90007, "name": "怪物7", "attack": 100, "quickness": 22, "hit": 24, "crit": 32, "defense": 16, "hp": 35000, "dodge": 16, "tenacity": 16, "attackSpeed": 0.94, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90008": { "ID": 90008, "name": "怪物8", "attack": 100, "quickness": 24, "hit": 26, "crit": 34, "defense": 17, "hp": 40000, "dodge": 17, "tenacity": 17, "attackSpeed": 0.93, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90009": { "ID": 90009, "name": "怪物9", "attack": 100, "quickness": 26, "hit": 28, "crit": 36, "defense": 18, "hp": 45000, "dodge": 18, "tenacity": 18, "attackSpeed": 0.92, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90010": { "ID": 90010, "name": "怪物10", "attack": 100, "quickness": 28, "hit": 30, "crit": 38, "defense": 19, "hp": 50000, "dodge": 19, "tenacity": 19, "attackSpeed": 0.91, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90011": { "ID": 90011, "name": "怪物11", "attack": 100, "quickness": 30, "hit": 32, "crit": 40, "defense": 20, "hp": 55000, "dodge": 20, "tenacity": 20, "attackSpeed": 0.9, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90012": { "ID": 90012, "name": "怪物12", "attack": 100, "quickness": 32, "hit": 34, "crit": 42, "defense": 21, "hp": 60000, "dodge": 21, "tenacity": 21, "attackSpeed": 0.89, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90013": { "ID": 90013, "name": "怪物13", "attack": 100, "quickness": 34, "hit": 36, "crit": 44, "defense": 22, "hp": 65000, "dodge": 22, "tenacity": 22, "attackSpeed": 0.88, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90014": { "ID": 90014, "name": "怪物14", "attack": 100, "quickness": 36, "hit": 38, "crit": 46, "defense": 23, "hp": 70000, "dodge": 23, "tenacity": 23, "attackSpeed": 0.87, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90015": { "ID": 90015, "name": "怪物15", "attack": 100, "quickness": 38, "hit": 40, "crit": 48, "defense": 24, "hp": 75000, "dodge": 24, "tenacity": 24, "attackSpeed": 0.86, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90016": { "ID": 90016, "name": "怪物16", "attack": 100, "quickness": 40, "hit": 42, "crit": 50, "defense": 25, "hp": 80000, "dodge": 25, "tenacity": 25, "attackSpeed": 0.85, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90017": { "ID": 90017, "name": "怪物17", "attack": 100, "quickness": 42, "hit": 44, "crit": 52, "defense": 26, "hp": 85000, "dodge": 26, "tenacity": 26, "attackSpeed": 0.84, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90018": { "ID": 90018, "name": "怪物18", "attack": 100, "quickness": 44, "hit": 46, "crit": 54, "defense": 27, "hp": 90000, "dodge": 27, "tenacity": 27, "attackSpeed": 0.83, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90019": { "ID": 90019, "name": "怪物19", "attack": 100, "quickness": 46, "hit": 48, "crit": 56, "defense": 28, "hp": 95000, "dodge": 28, "tenacity": 28, "attackSpeed": 0.82, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90020": { "ID": 90020, "name": "怪物20", "attack": 100, "quickness": 48, "hit": 50, "crit": 58, "defense": 29, "hp": 100000, "dodge": 29, "tenacity": 29, "attackSpeed": 0.81, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90021": { "ID": 90021, "name": "怪物21", "attack": 100, "quickness": 50, "hit": 52, "crit": 60, "defense": 30, "hp": 105000, "dodge": 30, "tenacity": 30, "attackSpeed": 0.8, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90022": { "ID": 90022, "name": "怪物22", "attack": 100, "quickness": 52, "hit": 54, "crit": 62, "defense": 31, "hp": 110000, "dodge": 31, "tenacity": 31, "attackSpeed": 0.79, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90023": { "ID": 90023, "name": "怪物23", "attack": 100, "quickness": 54, "hit": 56, "crit": 64, "defense": 32, "hp": 115000, "dodge": 32, "tenacity": 32, "attackSpeed": 0.78, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90024": { "ID": 90024, "name": "怪物24", "attack": 100, "quickness": 56, "hit": 58, "crit": 66, "defense": 33, "hp": 120000, "dodge": 33, "tenacity": 33, "attackSpeed": 0.77, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90025": { "ID": 90025, "name": "怪物25", "attack": 100, "quickness": 58, "hit": 60, "crit": 68, "defense": 34, "hp": 125000, "dodge": 34, "tenacity": 34, "attackSpeed": 0.76, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90026": { "ID": 90026, "name": "怪物26", "attack": 100, "quickness": 60, "hit": 62, "crit": 70, "defense": 35, "hp": 130000, "dodge": 35, "tenacity": 35, "attackSpeed": 0.75, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90027": { "ID": 90027, "name": "怪物27", "attack": 100, "quickness": 62, "hit": 64, "crit": 72, "defense": 36, "hp": 135000, "dodge": 36, "tenacity": 36, "attackSpeed": 0.74, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90028": { "ID": 90028, "name": "怪物28", "attack": 100, "quickness": 64, "hit": 66, "crit": 74, "defense": 37, "hp": 140000, "dodge": 37, "tenacity": 37, "attackSpeed": 0.73, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90029": { "ID": 90029, "name": "怪物29", "attack": 100, "quickness": 66, "hit": 68, "crit": 76, "defense": 38, "hp": 145000, "dodge": 38, "tenacity": 38, "attackSpeed": 0.72, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
    "90030": { "ID": 90030, "name": "怪物30", "attack": 100, "quickness": 68, "hit": 70, "crit": 78, "defense": 39, "hp": 150000, "dodge": 39, "tenacity": 39, "attackSpeed": 0.71, "idleAnim": 20001, "attackAnim": 20002, "deathAnim": 20003 },
};
export function getenemy_dataById(id) {
    return enemy_data[id] || null;
}

export function getenemy_dataByIndex(index) {
    let keys: string[] = Object.keys(enemy_data);
    return getenemy_dataById(keys[index]);
}
