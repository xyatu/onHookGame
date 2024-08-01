export var anim_data = {
    "20002": {"ID":20002,"name":"攻击","sound":10001,"soundRate":3,"plist":"Archer","rate":8,"loop":0,"anim":"Archer-export_17;Archer-export_18;Archer-export_19;Archer-export_20;Archer-export_21;Archer-export_22;Archer-export_23;Archer-export_24;Archer-export_25"},
    "20001": {"ID":20001,"name":"待机","sound":10001,"soundRate":3,"plist":"Archer","rate":8,"loop":1,"anim":"Archer-export_01;Archer-export_02;Archer-export_03;Archer-export_04;Archer-export_05;Archer-export_06"},
    "20003": {"ID":20003,"name":"死亡","sound":10001,"soundRate":3,"plist":"Archer","rate":8,"loop":0,"anim":"Archer-export_45;Archer-export_46;Archer-export_47;Archer-export_48"},
};
export function getanim_dataById(id) {
    return anim_data[id] || null;
}
