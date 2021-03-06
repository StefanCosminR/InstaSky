import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import entities from "./candidates/candidates.js";


export default class RenderListController extends ContainerController {
    constructor(element) {
        super(element);

        let currentView = JSON.parse(JSON.stringify(entities[0]));
        let entitiesModel = JSON.parse(JSON.stringify(entities));

        this.model = this.setModel({entities: entitiesModel, current: currentView, search: {value: ""}});

        this.model.addExpression("ifSearchValue",  () => {
            let searchValue = this.model.getChainValue("search.value");
            return searchValue.length>0;
            },"search.value");

        let getReloadedModel = () => {
            let searchedString = this.model.getChainValue("search.value");
            let filteredModel = entitiesModel.filter((entitity) => {
                return entitity.name.includes(searchedString);
            });
            this.model.setChainValue("entities", JSON.parse(JSON.stringify(filteredModel)));
        };

        this.model.onChange("search.value", getReloadedModel);

        element.addEventListener("changeView", (evt) => {
            evt.stopImmediatePropagation();
            let id = evt.data;
            let selected = entities.find(el => el.id.toString() === id.toString());
            this.model.setChainValue("current", JSON.parse(JSON.stringify(selected)));
        });


        element.addEventListener("remove", (evt) => {
            evt.stopImmediatePropagation();
            let id = evt.data;
            entitiesModel = entitiesModel.filter(el => el.id.toString() !== id.toString());
            getReloadedModel();
        })
    }
}
