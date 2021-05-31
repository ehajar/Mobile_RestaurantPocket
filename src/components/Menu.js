import React, { Component } from "react";
import _, { map } from "underscore";
import "./style/menu.css";
import Card from "react-bootstrap/Card";
import MenuService from "../services/menu.service";
import "./global";
import Button from "react-bootstrap/Button";
class Menu extends Component {
  state = {
    menu: [],
    resultat: [],
    plats: [],
    show: false,
    etatPanier:0,
    selectedItems:[],
    lastItemAdded:0,
    prixTotal:0
  };

  componentDidMount() {
    MenuService.getallmenu(global.qr).then(
      (response) => {
        const qr = response.data;
        this.setState({ qr });
        global.menu = qr;
        this.setState({ show: true });
        console.log(this.state.show);
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
    setTimeout(
      function () {
        this.setState({ show: true });
      }.bind(this),
      1000
    );
  }
  delete = (id)=>{
    var tmp=[]
    this.state.selectedItems.map((ele)=>{
      if(ele.id!==id){
        tmp = [...tmp,ele]
      }else{
        this.setState({
          prixTotal:this.state.prixTotal-ele.prix
        })
      }
    })
    this.setState({
      selectedItems:tmp
    })
  }
  exist(item) {
    this.state.resultat = _.keys(
      _.countBy(item, function (item) {
        return item.categorie;
      })
    );

    this.state.plats = item.reduce(function (r, a) {
      r[a.categorie] = r[a.categorie] || [];
      r[a.categorie].push(a);
      return r;
    }, Object.create(null));
  }

  render() {
    if (this.state.show) {
      this.exist(global.menu);
    }

    return (
      <section className="containera">
        <div className={this.state.etatPanier%2===0?"panierContent display-none":"panierContent display-block"} >
          {this.state.selectedItems.length!==0?<div className="content">
            <div className="items">
              {this.state.selectedItems.map((ele,index)=>{
                return <div key={index} className="item">
                        <p className="qte">{ele.qte}x</p>
                        <p className="title">{ele.title}</p>
                        <p className="prix">{ele.prix}DH</p>
                        <i onClick={()=>{
                          this.delete(ele.id);
                        }} class="icon bi bi-x"></i>
                      </div>
              })}
            </div>
            <div className="Total">
              <p className="title">Total : </p>
              <p className="prix">{this.state.prixTotal} DH </p>
            </div>
            <div className="controls">
              <Button onClick={()=>{
                alert(this.state.prixTotal)
              }} className="checkout">Check Out</Button>
            </div>
          </div>:<div className="EmptyList">
              <i class="bi bi-basket"></i>
              <p >Empty</p>
            </div>}
        </div>
        <div className="logo">
          <div className="hair"></div>
          <div className="menuA">Menu Restaurant {global.namerestaut}</div>
          <i onClick={()=>{
            this.setState({
              etatPanier:this.state.etatPanier+1,
            })
          }} class="bi log_panier bi-bag-check-fill"></i>
          <div className="hair"></div>
        </div>
        {this.state.resultat.map((resultatone) => (
          <div className="row__posters">
            <h1 className="categories">{resultatone}</h1>
            <div className="containt">
              {global.menu.map((menuone)=> {
                if (menuone.categorie == resultatone)
                  return (
                    <Card className="plat">
                      <Card.Img
                        className="image"
                        variant="top"
                        src={menuone.image}
                      />
                      <Card.Body>
                        <Card.Title className="titre">
                          {menuone.nomrepas}
                        </Card.Title>
                        <Card.Title className="titreprix">
                          {" "}
                          Prix : <span>{menuone.prix}</span> DH
                        </Card.Title>
                        <Card.Text className="description">
                          {menuone.description}
                        </Card.Text>
                        <Button onClick={()=>{
                          this.setState({
                            selectedItems:[...this.state.selectedItems,{
                              id:this.state.lastItemAdded+1,
                              qte:1,
                              title:menuone.nomrepas,
                              prix:menuone.prix
                            }],
                            prixTotal:this.state.prixTotal+menuone.prix,
                            lastItemAdded:this.state.lastItemAdded+1
                          })
                        }} className="ajouter">Ajouter</Button>
                      </Card.Body>
                    </Card>
                  );
              })}
            </div>
          </div>
        ))}
      </section>
    );
  }
}
export default Menu;
