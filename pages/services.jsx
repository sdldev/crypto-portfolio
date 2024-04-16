import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Header from '@components/Header'
import styles from '@styles/Services.module.scss'
import projects from 'data/projects'

let mainnetData = projects.mainnet
let testnetData = projects.testnet

const services = () => {
	return (
		<>
			<Head>
				<title>Services - zkNodes</title>
				<meta name='description' content='zkNodes | node Project' />
			</Head>

			<Header />
			<div className='w-full p-1 md:p-6 bg-white dark:bg-zinc-900/40'>
				<div
					className={styles.mainColumn__wrapper}
					style={{
						width: '100%',
						padding: '10px',
						marginTop: '60px'
					}}
				>
					<div className={styles.mainColumn}>
						<h1 style={{ paddingTop: '0px' }}>Services 🌟</h1>
						<br />
						<h2 id='mainnets' style={{ marginTop: '0', paddingTop: '5px' }}>
							Mainnet
						</h2>
						<div className={styles.mainnetColumn}>
							{Object.keys(mainnetData).map(item => {
								const name = mainnetData[item].name || item.charAt(0).toUpperCase() + item.slice(1)
								const serviceURL = '/services/mainnet/' + name.toLowerCase()

								return (
									<Link href={serviceURL} key={name} className={styles.chain__wrapper}>
										<Image
											src={require('@public/mainnet/'.concat(mainnetData[item].imgUrl))}
											alt='project logo'
											width='25'
											height='25'
										/>
										{name}
									</Link>
								)
							})}
						</div>
						<br />
						<h2 style={{ marginTop: '0', paddingTop: '5px' }} id='testnets'>
							Testnet
						</h2>
						<div className={styles.testnetColumn}>
							{Object.keys(testnetData).map(item => {
								const name = testnetData[item].name || item.charAt(0).toUpperCase() + item.slice(1)
								const serviceURL = '/services/testnet/' + name.toLowerCase()

								return (
									<Link href={serviceURL} key={name} className={styles.chain__wrapper}>
										<Image
											src={require('@public/testnet/'.concat(testnetData[item].imgUrl))}
											alt='project logo'
											width='25'
											height='25'
										/>
										{name}
									</Link>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default services
