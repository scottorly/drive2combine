import{P as g,h as e,f as h}from"./vendor.16792e99.js";const f=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&m(c)}).observe(document,{childList:!0,subtree:!0});function u(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=u(t);fetch(t.href,n)}};f();const w="token",v="comment",y="prolog",k="doctype",x="cdata",I="punctuation",C="namespace",V="tag",N="operator",M="number",D="property",E="selector",P="boolean",R="string",T="entity",S="url",O="style",A="keyword",L="control",U="directive",B="unit",J="statement",H="regex",F="atrule",j="placeholder",$="variable",q="deleted",G="inserted",K="italic",W="important",z="bold",X="highlight",_="constant",Y="symbol",Q="builtin",Z="char",ee="small",te="code";var b={"line-highlight":"line-highlight","line-numbers":"line-numbers","linkable-line-numbers":"linkable-line-numbers","line-numbers-rows":"line-numbers-rows",token:w,comment:v,prolog:y,doctype:k,cdata:x,punctuation:I,namespace:C,tag:V,operator:N,number:M,property:D,function:"function","tag-id":"tag-id",selector:E,"atrule-id":"atrule-id","language-javascript":"language-javascript","attr-name":"attr-name","language-css":"language-css","language-scss":"language-scss",boolean:P,string:R,entity:T,url:S,style:O,"attr-value":"attr-value",keyword:A,control:L,directive:U,unit:B,statement:J,regex:H,atrule:F,placeholder:j,variable:$,deleted:q,inserted:G,italic:K,important:W,bold:z,highlight:X,constant:_,symbol:Y,builtin:Q,char:Z,"class-name":"class-name",small:ee,code:te};const o=({children:s,attributes:{snippet:a,dataline:u}})=>e(h,null,e("p",null,s),e("figure",{className:b.small},e("pre",{"data-line":u},e("code",{className:`${b.code} language-swift`},a)))),i=({children:s,attributes:{href:a}})=>e("a",{target:"_blank",rel:"noreferrer noopener",href:a},s);let d=0,p=0;const r=({children:s})=>(d++,e(h,null,e("label",{for:d,className:"margin-toggle"},"\u2295"),e("input",{type:"checkbox",id:d,className:"margin-toggle"}),e("span",{className:"marginnote"},s))),l=({children:s})=>(p++,e(h,null,e("label",{for:`${p}a`,className:"margin-toggle sidenote-number"}),e("input",{type:"checkbox",id:`${p}a`,className:"margin-toggle"}),e("span",{className:"sidenote"},s))),ne=e("article",null,e("section",null,e("h1",null,"DRIVE II: COMBINE"),e("p",{className:"subtitle"},e("a",{href:"https://scottorly.github.io"},"Scott Orlyck"))),e("section",null,e("img",{src:"https://images.unsplash.com/photo-1565647952915-9644fcd446a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"}),e("blockquote",null,`"We ain't driving tractors here."`)),e("section",null,e("p",null,e("span",{className:"newthought"},"In our ",e(i,{href:"https://scottorly.github.io/drive"},"last episode")),", we implemented some practical iOS UI programming techniques using RxSwift's ",e(i,{href:"https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver"},"Driver trait")," and UIKit. This time we are going to explore some of the same patterns using Apple's reactive programming framework ",e(i,{href:"https://developer.apple.com/documentation/combine"},"Combine"),". Implemented with discipline, Rx based architectures can help you avoid smelly anti-patterns like half-cooked spagehetti",e(l,null,"Not enough seperation of concerns.")," or over-cooked lasgna",e(l,null,"Too much seperation of concerns."),", but as with all things it comes with trade-offs."),e("p",null,"One of the biggest problems with Rx architectures is the steep learning curve of not only the reactive language extensions themselves but also learning to reason about the system as a declarative stream of events and data as opposed to imperative statefulness. Lucky for us then that Combine adds some much needed developer ergonomics to reactive extensions that makes things a lot easier when operating on publishers across API boundaries.")),e("section",null,e("h2",null,"THE RETURN OF THE DRIVER"),e("p",null,e(r,null,"Find the source code for a project with working examples  ",e(i,{href:"https://github.com/scottorly/drive2combine/tree/main/xcode"},"here"),".")),e("p",null,"If you recall, RxSwift's ",e(i,{href:"https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver"},"Driver Trait"),' is a guarantee that the publisher is shared with the last element replayed upon subscription, the subscription is always received on the main thread, and the publisher can never error out. It is instructive to think about Drivers as UI or system events "driving the application".'),e("p",null,"One of the main drivers",e(l,null,"I am so sorry.")," of the RxSwift Driver trait was to help make dealing with type inference across API boundaries less problematic. Combine's convenient ",e(i,{href:"https://developer.apple.com/documentation/combine/just/erasetoanypublisher()"},"eraseToAnyPublisher")," API makes this aspect of the driver trait redundant however it is instructive to walk through the implementation with Combine and the result leaves us with some easily re-usable Rx patterns."),e("p",null,"One of the nice things about Combine compared to RxSwift is that the API is much simpler. The primary drawback of this simplicity is that we will need to import CombineExt to provide some operators we need for this architecture pattern to be successful. Nonetheless our code is going to look a lot cleaner thanks to Combine's integration with Foundation. Apple does not provide default publishers for UIKit control events so we will need to add CombineCocoa to our project as well."),e("p",null,"Below are two extensions to Publisher to fulfill our requirements for a Driver. The first demonstrates how to use an ",e(i,{href:"https://developer.apple.com/documentation/combine/empty"},"Empty")," publisher to convert a Publisher error type to Never."),e(o,{snippet:`import CombineExt
                
typealias Driver<T> = AnyPublisher<T, Never>
typealias Bag = Set<AnyCancellable>

extension Publisher {
    func driver() -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Empty(completeImmediately: true).eraseToAnyPublisher()
        }
        .share(replay: 1)
        .receive(on: RunLoop.main)
        .eraseToAnyPublisher()
    }
}`,dataline:"3-4,8-12"},e(r,{id:"b"},"Lines 3-4: Some typealias conveniences.",e("br",null),"Lines 8-9: Catch and return an Empty publisher to convert the error type to Never.",e("br",null),"Line 11: Share and replay the last element.",e("br",null),"Line 12: Receive on the main thread.")),e(o,{snippet:`func driver(onErrorJustReturn: Output) -> Driver<Output> {
    \`catch\` { error -> Just<Output> in
        Just(onErrorJustReturn)
    }
    .share(replay: 1)
    .receive(on: RunLoop.main, options: nil)
    .eraseToAnyPublisher()
}`,dataline:"3"},e(r,null,"If it makes more sense to provide a default value to the driver function wrap the default value parameter in a Just publisher instead of returning an Empty publisher.")),e(o,{snippet:`extension UITextField {
    func textDriver() -> Driver<String> {
        textPublisher.replaceNil(with: "").driver()
    }
}`,dataline:"3"},e(r,null,"One more extension for our UITextfield publisher so we don't have to worry about unwrapping optionals anywhere along our publisher chain."))),e("section",null,e("h2",null,"MVVM + VC"),e("p",null,"We can't accurately call this pattern MVVM becuase it's more like Model-View-ViewModel-ViewController. The ViewController is responsible for connecting the ViewModel to the Views as well as managing the navigation stack which is exactly what UIViewControllers are supposed to do!"),e("p",null,"Take a look at the ViewModel implementation below as now is a good time to review some rules",e(l,null,"The ViewModel cannot import UIKit and will never subscribe to any publishers.")," to help enforce seperation of concerns and prevent side effects."),e(o,{snippet:`import Combine
import CombineExt

class ViewModel {
    
    let validatedUsername: Driver<Validation>
    let validatedPassword: Driver<Validation>
    let enabled: Driver<Bool>
    let loggedIn: Driver<Response>
`,dataline:""},e(r,null,e("br",null))),e("p",null,"Initialize the ViewModel with the IBOutlet drivers."),e(o,{snippet:`init(
    username: Driver<String>,
    password: Driver<String>,
    login: AnyPublisher<Void, Never>
) {
    validatedUsername = username.flatMapLatest {
        Validator.shared.username(username: $0)
    }.driver(onErrorJustReturn: .failed("Invalid username."))
    
    validatedPassword = password.flatMapLatest {
        Validator.shared.password(password: $0)
    }.driver(onErrorJustReturn: .failed("Invalid password"))
`,dataline:"1,6,10"},e(r,null,e("br",null))),e("p",null),e(o,{snippet:`    let combined = Publishers.CombineLatest(
        validatedUsername,
        validatedPassword
    )

    enabled = combined
        .flatMapLatest { username, password -> Just<Bool> in
            if case (.success, .success) = (username, password) {
                return Just(true)
            }
            return Just(false)
        }.driver(onErrorJustReturn: false)

    let combinedCredentials = Publishers
        .CombineLatest(
            username,
            password
        )

    loggedIn = login.withLatestFrom(combinedCredentials)
        .flatMapLatest {
            Network.shared.login(username: $0, password: $1)
        }.driver()`,dataline:"1,6,14,20"},e(r,null,e("br",null))),e("p",null,"The ViewModel isn't too much different than last time except now it is significantly simpler. Define the outputs, connect the inputs and subscribe in the ViewController. Bish bash bosh, next thing you know, Robert's your father's brother."),e("p",null,"One thing we wont be implementing here is the drive function itself which serves as a type erased replacement for subscribe in RxSwift. Combine's built-in type erasure has already made our API boundaries tidy and easy to work with."),e(o,{snippet:`import CombineCocoa

class ViewController: UIViewController {
    
    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var login: UIButton!

    var bag = Bag()

    lazy var viewModel: ViewModel = {
        ViewModel(
            username: username.textDriver(),
            password: password.textDriver(),
            login: login.tapPublisher)
    }()

}`,dataline:"5,6,7,9,11"},e(r,null," ")),e("p",null,"Back in our ViewController we can start to connect the ViewModel outputs to the Views."),e(o,{snippet:`viewModel.validatedUsername
    .sink { [weak self] validation in
        if case .failed(let message) = validation {
            self?.usernameError.text = message
            self?.usernameError.isHidden = false
        } else {
            self?.usernameError.isHidden = true
        }
    }.store(in: &bag)

    viewModel.validatedPassword
        .sink { [weak self] validation in
            if case .failed(let message) = validation {
                self?.passwordError.text = message
                self?.passwordError.isHidden = false
            } else {
                self?.passwordError.isHidden = true
            }
    }.store(in: &bag)`,dataline:""},e(r,null,"Since the ViewModel outputs are all Drivers we can rest assured that our subscriptions will be received on the main thread.")),e("p",null,"Now we can connect the login button enabled state and the request result outlets."),e(o,{snippet:`viewModel.enabled.sink { [weak self] enabled in
    self?.login.isEnabled = enabled
}.store(in: &bag)

viewModel.loggedIn.sink { [weak self] response in
    if case .success = response {
        self?.performSegue(withIdentifier: "LOGGEDIN", sender: nil)
    }
}.store(in: &bag)`},e(r,null,"As always, don't forget to use weak self, put the subscriptions in the bag, and call your bind function in viewDidLoad."))),e("section",null,e("h2",null,"IN THE BAG"),e("p",null,"Next time we'll explore async/await ;)")),e("section",null,e("h3",null,"Acknowledgements"),e("p",null,"Styles by ",e(i,{href:"https://edwardtufte.github.io/tufte-css/"},"Tufte-CSS"),"."),e("p",null,"Syntax by ",e(i,{href:"https://prismjs.com/"},"PrismJS"))),e("footer",null,e("em",null,"Copyright \xA9 2021 Scott Orlyck. All rights reserved.")));document.body.appendChild(ne);g.highlightAll();
