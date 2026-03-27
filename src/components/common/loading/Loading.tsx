import Loading from "/loading.png";
import LoadingDark from "/loading-dark.png";
import "../../../styles/animations/animation.css"
import './loading.css'

function loading() {
  return (
    <div>
      <picture>
        <source className="loading rotating" srcSet={LoadingDark} media="(prefers-color-scheme: dark)"/>
        <img className="loading rotating" src={Loading} alt={'ᵔ ᵕ ᵔ'}/>
      </picture>

    </div>
  )
};

export default loading;