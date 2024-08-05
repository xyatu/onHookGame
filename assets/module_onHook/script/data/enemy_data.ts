export var enemy_data = {
    "90001": {"ID":90001,"name":"怪物1","attack":50,"quickness":10,"hit":12,"crit":20,"defense":10,"hp":5000,"dodge":10,"tenacity":10,"attackSpeed":1,"idleAnim":20001,"moveAnim":20002,"attackAnim1":20003,"attackAnim2":20004,"attackAnim3":20005},
    "90002": {"ID":90002,"name":"怪物2","attack":100,"quickness":12,"hit":14,"crit":22,"defense":11,"hp":10000,"dodge":11,"tenacity":11,"attackSpeed":0.99,"idleAnim":20006,"moveAnim":20007,"attackAnim1":20008,"attackAnim2":20009,"attackAnim3":20010},
    "90003": {"ID":90003,"name":"怪物3","attack":100,"quickness":14,"hit":16,"crit":24,"defense":12,"hp":15000,"dodge":12,"tenacity":12,"attackSpeed":0.98,"idleAnim":20011,"moveAnim":20012,"attackAnim1":20013,"attackAnim2":20014,"attackAnim3":20015},
};
export function getenemy_dataById(id) {
    return enemy_data[id] || null;
}
