import Loading from "./Loading"
import './loading.css';

function FullScreenLoading() {
  return (
	<div className="full-screen-loading">
		<div className="screen-center">
			<Loading/>
		</div>
	</div>
  )
}

export default FullScreenLoading