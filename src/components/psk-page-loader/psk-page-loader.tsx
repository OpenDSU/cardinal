import {Component, h, Prop, State, Watch} from "@stencil/core";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-page-loader',
  shadow: true
})
export class PskPageLoader {

  @TableOfContentProperty({
    description: [`This property is the url for the page that needs to be loaded.`,
      `When this component loads a get http request will be issued and the cotent of that url will be rendered if it can be accessed.`],
    isMandatory: true,
    propertyType: 'string'
  })
  @Prop() pageUrl: string;

  @Watch('pageUrl')
  watchHandler(newValue: boolean) {
    this.getPageContent(newValue, this.getPageHandler());
  }

  @State() pageContent: string;
  @State() errorLoadingPage: boolean = false;

  componentWillLoad() {
    return new Promise((resolve) => {
      this.getPageContent(this.pageUrl, this.getPageHandler.bind(this)(()=>{
        resolve();
      }));
    })
  }

  getPageHandler(callback?: Function) {
    let self = this;
    return (err, data) => {

      if (err) {
        self.errorLoadingPage = true;
      } else {
        self.errorLoadingPage = false;
        self.pageContent = data;
      }
      if (typeof callback === "function") {
        callback();
      }
    }
  }

  getPageContent(pageUrl, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', pageUrl);

    xhr.onload = () => {
      if (xhr.status != 200) {
        callback(new Error("Some error occurred"));
      } else {
        console.log(xhr.status);
        callback(null, xhr.responseText);
      }
      callback();
    };

    xhr.onerror = () => {
      this.errorLoadingPage = true;
    };
    xhr.send();
  }

  render() {
    return (

      this.errorLoadingPage ?

        <h4>{`Page ${this.pageUrl} could not be loaded!`}</h4> :
        <div class="page_content" innerHTML={this.pageContent}/>

    )
  }
}
