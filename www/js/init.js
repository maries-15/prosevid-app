var firebaseRef = 'https://prosevid-app.firebaseio.com/';
var applicationConfig = {
    REF: firebaseRef,
    USERS: firebaseRef + '/users',
    QUESTIONS: firebaseRef + '/questions',
    TROPHIES:firebaseRef + '/trophies'
}

var preguntasAcertadas = {
    incendios:0,
    evacuacion:0,
    primerosAuxilios:0
};
var trophies = {
    a_bomberito:{
        state:false
    },
    b_bombero:{
        state:false
    },
    c_capitan:{
        state:false
    },
    d_cadete:{
        state:false
    },
    e_rescatista:{
        state:false
    },
    f_brigadista:{
        state:false
    },
    g_enfermerito:{
        state:false
    },
    h_enfermero:{
        state:false
    },
    i_jefe:{
        state:false
    },
    j_estudiante:{
        state:false
    },
    k_maestro:{
        state:false
    },
    l_experto:{
        state:false
    }
};
var descriptionTrophies = {
    a_bomberito:{
        description:"Responde correctamente 8 preguntas de incendios."
    },
    b_bombero:{
        description:"Responde correctamente 15 preguntas de incendios."
    },
    c_capitan:{
        description:"Responde correctamente 25 preguntas de incendios."
    },
    d_cadete:{
        description:"Responde correctamente 8 preguntas de evacuación."
    },
    e_rescatista:{
        description:"Responde correctamente 15 preguntas de evacuación."
    },
    f_brigadista:{
        description:"Responde correctamente 25 preguntas de evacuación."
    },
    g_enfermerito:{
        description:"Responde correctamente 15 preguntas de primeros auxilios."
    },
    h_enfermero:{
        description:"Responde correctamente 25 preguntas de primeros auxilios."
    },
    i_jefe:{
        description:"Responde correctamente 40 preguntas de primeros auxilios."
    },
    j_estudiante:{
        description:"Consigue 50 cruces."
    },
    k_maestro:{
        description:"Consigue 80 cruces."
    },
    l_experto:{
        description:"Consigue 120 cruces."
    }
};