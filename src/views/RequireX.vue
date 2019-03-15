<template>
  <div>
    <div v-if="validation">
      <v-alert
        color="red"
        :value="!formValid"
        type="error"
        transition="scale-transition"
      >Please, check the fields.</v-alert>
    </div>
    <div>
      <v-form v-model="formValid" ref="requireXForm">
        <v-jsonschema-form
        v-if="schema"
        :schema="schema"
        :model="dataObject"
        :options="options"
        @error="showError"
        @change="change"
        @input="input"
        />
        <v-btn @click="submit()" dark  color="success" >Generate</v-btn>
      </v-form>
    </div>

    <div class="text-xs-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>RequireX</v-card-title>

          <v-card-text>
            <h1>{{ this.dataObject.name }}</h1>
            <pre>{{ JSON.stringify(dataObject, null, 2) }}</pre>
            <p>{{this.require}}</p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">I accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuetify from "vuetify";

import Draggable from "vuedraggable";
import axios from "axios";
import VueAxios from "vue-axios";
import Swatches from "vue-swatches";


import VJsonschemaForm from "@koumoul/vuetify-jsonschema-form";

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

Vue.component("swatches", Swatches);
Vue.component("draggable", Draggable);

export default {
  components: { VJsonschemaForm },
  data() {
    return {
      dialog: false,
      require: "",
      schema: {
        description: "RequireX Template",
        type: "object",
        required: ["reqType", "name", "imperative", "systemActivity"],
        properties: {
          reqType: {
            title: "Requirement Type",
            type: "string",
            oneOf: [
              {
                const: "Constraint",
                title: "Constraint"
              },
              {
                const: "FunctionalReq",
                title: "Functional Requirements"
              },
              {
                const: "QualityReq",
                title: "Quality Requirement"
              }
            ]
          },
          name: {
            title: "Requirements name",
            type: "string"
          },
          condition: {
            title: "Requirement have a conditional?",
            type: "boolean"
          },
          imperative: {
            title: "Imperative",
            type: "string",
            enum: ["Must", "Should", "Could"]
          }
        },
         oneOf: [
              {
                $ref: "#/definitions/userInt"
              },
              {
                $ref: "#/definitions/autoAct"
              },
              {
                $ref: "#/definitions/extInt"
              }
            ],
        dependencies: {
          condition: {
            properties: {
              conditionDescription: {
                title: "Plase enter a condition",
                type: "string",
                maxLength: 2000,                
              }
            },
            required: ["conditionDescription"]
          },
          imperative: {
            properties: {
              systemName: {
                title: "System or System Family Name",
                type: "string"
              }
            },
            required: ["systemName"]
          }
        },
        definitions: {
          userInt: {
            title: "User Interaction",
            properties: {
              systemActivity: {
                type: "string",
                title: "System Activity",
                const: "userInt"
              },
              user: {
                title: "User",
                type: "string"
              },
              processVerb: {
                title: "Process Verb",
                type: "string"
              },
              object: {
                title: "Objet (Noun)",
                type: "string"
              },
              systemConditionDescriptionState: {
                title: "Object have a conditional?",
                type: "boolean"
              }
            },
            required: ["user", "processVerb", "object"],
            dependencies: {
              systemConditionDescriptionState: {
                properties: {
                  systemConditionDescription: {
                    type: "string",
                    title:
                      'Plase enter a condition of the type "if and only if"',
                    maxLength: 2000
                  }
                },
                required: ["systemConditionDescription"]
              }
            }
          },
          autoAct: {
            title: "Autonomous Activity",
            properties: {
              systemActivity: {
                type: "string",
                const: "autoAct"
              },
              processVerb: {
                title: "Process Verb",
                type: "string"
              },
              object: {
                title: "Objet (Noun)",
                type: "string"
              },
              systemConditionDescriptionState: {
                title: "Object have a conditional?",
                type: "boolean"
              }
            },
            required: ["processVerb", "object"],
            dependencies: {
              systemConditionDescriptionState: {
                properties: {
                  systemConditionDescription: {
                    type: "string",
                    title:
                      'Plase enter a condition of the type "if and only if"',
                    maxLength: 2000
                  }
                },
                required: ["systemConditionDescription"]
              }
            }
          },
          extInt: {
            title: "External Interface",
            properties: {
              systemActivity: {
                type: "string",
                const: "extInt"
              },
              system: {
                title: "External System or Device",
                type: "string"
              },
              from: {
                title: "Interface requirement interaction",
                type: "string",
                enum: ["From", "To"]
              },
              processVerb: {
                title: "Process Verb",
                type: "string"
              },
              object: {
                title: "Objet (Noun)",
                type: "string"
              },
              systemConditionDescriptionState: {
                title: "Object have a conditional?",
                type: "boolean"
              }
            },
            required: ["system", "from", "processVerb", "object"],
            dependencies: {
              systemConditionDescriptionState: {
                properties: {
                  systemConditionDescription: {
                    type: "string",
                    title:
                      'Plase enter a condition of the type "if and only if"',
                    maxLength: 2000,
                    description: "It is a conditional of the object and is optional, the expression Si is used and only if"
                  }
                },
                required: ["systemConditionDescription"]
              }
            }
          }
        }
      },
      dataObject: {},
      formValid: false,
      validation: false,
      options: {
        debug: false,
        disableAll: false,
        autoFoldObjects: true
      }
    };
  },
  methods: {
    showError(err) {
      window.alert(err);
    },
    submit() {     

      if (this.$refs.requireXForm.validate()) {      
        //Si hay una condición
        if(this.dataObject.condition){
            this.require += this.dataObject.conditionDescription + " ";
        }

        this.require = "The " + this.dataObject.systemName + " " + this.dataObject.imperative;
        //Validate system activity
        if(this.dataObject.systemActivity == "userInt"){
          this.require += " " + this.dataObject.processVerb + " " + this.dataObject.object ;
        }else if(this.dataObject.systemActivity == "userInt"){
          this.require += " provide the " + this.dataObject.user + " the capacity ";
          this.require += " " + this.dataObject.processVerb + " " + this.dataObject.object ;
        }else{
          this.require += " have the capacity of " + this.dataObject.processVerb + " " 
          + this.dataObject.object + " "  + this.dataObject.from  + " the " + this.dataObject.system; 
        }

        //Validat conditions
        if(this.dataObject.systemConditionDescriptionState){
           this.require += ", " + this.dataObject.systemConditionDescription; 
        }
       
        this.dialog = true;
      } else {
        this.validation = true;
      }
    },
    change(e) {
      console.log('"change" event', e);
    },
    input(e) {
      console.log('"input" event', e);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

