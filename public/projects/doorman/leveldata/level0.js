const level0 = {
    "background":"assets/backgrounds/sky-background.png",
    "blocks":{
        "dirt":{
            "x":[[0,11],[14,16],[17,22],[23,32],[33,39]],
            "y":[[0,1],[0,1],[0,3],[0,1],[0,4]]
        },
        "grass":{
            "x":[[0,11],[14,16],[17,22],[23,26],[33,39]],
            "y":[[2,2],[2,2],[4,4],[2,2],[5,5]]
        },
        "redbrick":{
            "x":[[24,25],[27,28],[30,31]],
            "y":[[6,6],[7,7],[8,8]]
        },
        "spikes":{
            "x":[[27,32]],
            "y":[[2,2]],
            "lethal":true
        }
    },
    "mobs":{
        "krunk":{
            "x":[8,19,35],
            "y":[3,5,6],
            "movement":[[0,0],[2,3],[2,2]]
        }
    },
    "spawn":{
        "x":2,
        "y":3
    },
    "coins":{
        "x":[23,25,26,29,33],
        "y":[8,4,9,10,10]
    },
    "end":{
        "x":38,
        "y":6
    },
    "floor": -3
}