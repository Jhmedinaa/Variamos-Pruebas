<template>
<v-form v-model="formValid">
    <v-jsonschema-form v-if="schema" :schema="schema" :model="dataObject" :options="options" @error="showError" />
  </v-form>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
import Draggable from 'vuedraggable'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Swatches from 'vue-swatches'

import VJsonschemaForm from '@koumoul/vuetify-jsonschema-form'

Vue.use(Vuetify)
Vue.use(VueAxios, axios)

Vue.component('swatches', Swatches)
Vue.component('draggable', Draggable)

export default {
  components: {VJsonschemaForm},
  data() {
    return {
      schema: {
  "description": "RequireX Template",
  "type": "object",
 "properties": {
   "ReqType":{
      "title":"Requirement Type",
      "type":"string",
      "oneOf":[
        {
          "const":"Constraint",
          "title":"Constraint"
        },
        {
          "const":"FunctionalReq",
          "title":"Functional Requirements"
        },
                {
          "const":"QualityReq",
          "title":"Quality Requirement"
        }
      ]
    },
    "name": {
      "title":"Requirements name",
      "type": "string"
    },
  },
  "allOf": [
    {
      "$ref": "#/definitions/propertiesA"
    },
    {
      "$ref": "#/definitions/propertiesB"
    }
  ],
  "oneOf": [
    {
      "$ref": "#/definitions/userInt"
    },
    {
      "$ref": "#/definitions/autoAct"
    },
    {
      "$ref": "#/definitions/extInt"
    }
  ],
  "definitions": {
    "propertiesA": {
      "properties": {
        "condition": {
        "title": "Requirement have a conditional?",
        "type": "boolean"
        }  
      },
      "dependencies": {
        "condition": {
          "properties": {
            "ConditionDescription": {
              "title":"Plase enter a condition",
              "type": "string",
              "maxLength": 2000
            }
          }
        }
      }
    },
    "propertiesB": {
      "properties": {
        "Imperative":{
          "title":"Imperative",
          "type":"string",
          "enum":[
            "Must", "Should","Could"
          ]
        },
      },
        "dependencies":{
          "Imperative":{
            "properties":{
              "SystemName":{
                "title":"System or System Family Name",
                "type":"string"
              }
            }
            
          }
        }
    },
    "userInt": {
      "title": "User Interface",
      "properties": {
        "type": {
          "type": "string",
          "title": "System Activity",
          "const": "userInt"
        },
        "User":{
          "title":"User",
          "type":"string"
        },
        "ProcessVerb":{
          "title":"Process Verb",
          "type":"string"
        },
        "Object":{
          "title":"Objet (Noun)",
          "type":"string"
        },
        "Objectcondition": {
        "title": "Object have a conditional?",
        "type": "boolean"
        }  
      },
      "dependencies":{
        "Objectcondition": {
          "properties": {
            "ConditionDescription": {
              "type": "string",
              "title":"Plase enter a condition of the type \"if and only if\"",
              "maxLength": 2000
            }
          }
        }
      }
    },
    "autoAct": {
      "title": "Autonomous Activity",
      "properties": {
        "type": {
          "type": "string",
          "const": "autoAct"
        },
        "ProcessVerb":{
          "title":"Process Verb",
          "type":"string"
        },
        "Object":{
          "title":"Objet (Noun)",
          "type":"string"
        },
        "Objectcondition": {
        "title": "Object have a conditional?",
        "type": "boolean"
        }  
      },
      "dependencies":{
        "Objectcondition": {
          "properties": {
            "ConditionDescription": {
              "type": "string",
              "title":"Plase enter a condition of the type \"if and only if\"",
              "maxLength": 2000
            }
          }
        }
      }
    },
    "extInt": {
      "title":"External Interface",
      "properties": {
        "type":{
          "type": "string",
          "const": "extInt"
        },
        "System":{
          "title":"External System or Device",
          "type":"string"
        },
        "From":{
        "title": "Interface requirement interaction",
        "type": "string",
        "enum":[
          "From","To"
        ]
        },
        "ProcessVerb":{
          "title":"Process Verb",
          "type":"string"
        },
        "Object":{
          "title":"Objet (Noun)",
          "type":"string"
        },
        "Objectcondition": {
        "title": "Object have a conditional?",
        "type": "boolean"
        } 
      },
      "dependencies":{
        "Objectcondition": {
          "properties": {
            "ConditionDescription": {
              "type": "string",
              "title":"Plase enter a condition of the type \"if and only if\"",
              "maxLength": 2000
            }
          }
        }
      }
    }
  }
  
},
      dataObject: {},
      formValid: false,
      options: {
        debug: false,
        disableAll: false,
        autoFoldObjects: true
      }
    }
  },
  methods: {
    showError(err) {
      window.alert(err)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

