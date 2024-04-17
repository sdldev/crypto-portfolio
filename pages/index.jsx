import { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Tabs } from 'antd'

import Header from '@components/Header'
import { Context } from '@context/context'
import { smoothScroll } from '@utils/smoothScroll'
import { opacityBlock } from '@data/transitions'
import { countApr } from '@utils/updateAPR'
import projects from '@data/projects.json'
import Spinner from '@components/UI/Spinner'
import styles from '@styles/Home.module.scss'
import Card from '@components/UI/Card'
const Footer = dynamic(() => import('@components/Footer'))
const FloatButton = dynamic(() => import('@components/UI/FloatButton'))

export async function getStaticProps() {
	return {
		props: { projects }
	}
}

const Home = () => {
	const { theme, toggleTheme } = useContext(Context)
	const [aprValues, setAprValues] = useState(null)
	const [projectsCount, setProjectsCount] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const onPageLoad = () => {
			setIsLoading(false)
		}

		const fetchAprValues = async () => {
			const entries = Object.entries(projects.mainnet)
			const promises = entries.map(async ([name]) => {
				const apr = await countApr(name)
				return { name, apr }
			})

			const results = await Promise.all(promises)
			const aprValues = results.reduce((acc, { name, apr }) => {
				acc[name] = apr
				return acc
			}, {})

			setAprValues(aprValues)
		}

		fetchAprValues()

		setProjectsCount(prev => ({
			...prev,
			mainnet: Object.entries(projects.mainnet)?.length,
			testnet: Object.entries(projects.testnet)?.length
		}))

		console.log('%czkNodes.org', 'color: red; font-size: 24px;')

		if (document.readyState === 'complete') {
			onPageLoad()
		} else {
			window.addEventListener('load', onPageLoad)

			return () => window.removeEventListener('load', onPageLoad)
		}
	}, [])

	const listVision = [

		['Shaping the Future', '/images/vision/vision1.png', 'Our vision for shaping the future of zkNodes is rooted in a deep understanding of the challenges and opportunities ahead. We envision a future that embodies positive change and progress driven by our technology.'],
		['Empowering Partnerships', '/images/vision/vision2.png', 'Collaboration and partnerships are central to our vision. We strive to cultivate mutually beneficial relationships'],
		['Global Impact', '/images/vision/vision3.png', 'We aspire to make a positive and long-lasting impact on a global scale. Our solutions will address critical challenges.'],
		['Ethical and Responsible Practices', '/images/vision/vision4.png', 'We are dedicated to conducting business in a responsible manner, upholding the highest ethical standards, and being accountable to stakeholders.'],

	]

	const items = [

		{
			key: '2',
			label: `Mainnet (${projectsCount?.mainnet})`,
			children: (
				<>
					<Card data={projects.mainnet} aprValues={aprValues} />
				</>
			)
		},
		{
			key: '3',
			label: `Testnet (${projectsCount?.testnet})`,
			children: (
				<>
					<Card data={projects.testnet} />
				</>
			)
		}
	]

	if (isLoading) {
		return <Spinner />
	}

	return (
		<>
			<Head>
				<title>zkNodes project</title>
				<meta
					name='description'
					content='zkNodes.org Fair working with team and as a partner for digitalization, we have have best service for community.'
				/>
				<meta
					name='keywords'
					content='cosmos, cosmos installation, nodes, blockchain'
				/>
			</Head>
			<Header />

			<main>
				<FloatButton />
				<section
					className={styles.hero}
					style={{
						backgroundColor: theme === 'dark' ? '#0e121f' : ' #fff'

					}}
				>
					<div className={styles.container}>
						<motion.div
							initial='hidden'
							animate='visible'
							variants={opacityBlock}
							className={styles.hero__wrapper}
						>
							<div className={styles.hero__column} id={styles.hero__descStaking}>
								<div className={styles.hero__columnRoot}>
									<h1 className='font-bold  mb-[15px] text-[26px] md:text-[38px] lg:text-[50px]'>
										zkNodes
									</h1>
									<span className={styles.hero__desc}>
										Fair working with team and as a partner for digitalization, we have have best service for community
									</span>
								</div>
							</div>
						</motion.div>
					</div>
				</section>


				<section
					style={{
						backgroundColor: theme === 'dark' ? '#0e121f' : ' #fff'
					}}
				>
					<div className={styles.container}>
						<motion.div
							initial='hidden'
							animate='visible'
							variants={opacityBlock}
							className={styles.hero__wrapper}
						>
							<div className={styles.hero__column} id={styles.hero__descStaking}>
								<div className={styles.hero__columnRoot}>
									<ul className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12">
										{listVision.map(([name, logo, description]) => (
											<li key={name}>
												<motion.section
													id='networks'
													initial='hidden'
													whileInView='visible'
													viewport={{ once: true }}
													variants={opacityBlock}
												>
													<div className="relative flex justify-center mx-auto items-center size-24 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-blue-600 before:via-transparent before:to-violet-600 before:rounded-xl dark:bg-slate-900">
														<div className="h-24 w-24">

															<img src={logo} alt={name} />
														</div>
													</div>
													<div className="mt-5">
														<h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h3>
														<p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
													</div>
												</motion.section>
											</li>
										))}
									</ul>
								</div>
							</div>
						</motion.div>
					</div>

					<motion.div
						initial='hidden'
						animate='visible'
						variants={opacityBlock}
						className={styles.hero__wrapper}
					>

						<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
							<div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
								<div>
								<img src="/images/earth.png" alt="zknodes" class="">
								</img>
									{/* <HomeGLobe client:load /> */}
								</div>

								<div class="mt-5 sm:mt-10 lg:mt-0">
									<div class="space-y-6 sm:space-y-8">
										<div class="space-y-2 md:space-y-4">
											<h2
												class="font-bold text-3xl lg:text-4xl text-gray-800 dark:text-gray-200"
											>
												zkNodes Service
											</h2>
											<p class="text-gray-500">
												Besides working with team and as a partner for digitalization, we
												have have best service for community
											</p>
										</div>

										<ul role="list" class="space-y-2 sm:space-y-4">
											<li class="flex space-x-3">
												<span
													class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
												>
													<svg
														class="flex-shrink-0 size-3.5"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													><polyline points="20 6 9 17 4 12"></polyline></svg
													>
												</span>

												<span class="text-sm sm:text-base text-gray-500">
													zkNodes is committed to providing a secure and stable service for
													our users by maintaining a high level of uptime and security. Our
													team consists of experienced experts who continuously monitor the
													network and ensure that it is running smoothly.
												</span>
											</li>

											<li class="flex space-x-3">
												<span
													class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
												>
													<svg
														class="flex-shrink-0 size-3.5"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													><polyline points="20 6 9 17 4 12"></polyline></svg
													>
												</span>

												<span class="text-sm sm:text-base text-gray-500">
													By staking your tokens with zkNodes, you not only contribute to
													the security of the network but also earn rewards for your
													participation. Our competitive staking fees ensure that you
													receive the maximum return on your investment.
												</span>
											</li>

											<li class="flex space-x-3">
												<span
													class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
												>
													<svg
														class="flex-shrink-0 size-3.5"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													><polyline points="20 6 9 17 4 12"></polyline></svg
													>
												</span>

												<span class="text-sm sm:text-base text-gray-500">
													At zkNodes, we believe in the power of decentralization and are
													committed to building a more equitable and transparent financial
													system. Join us today and start earning rewards while contributing
													to the growth of the blockchain ecosystem.
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</motion.div>


					<motion.section
						id='networks'
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={opacityBlock}
					>
						<div className={styles.container}>
							<h2 className='text-[22px] md:text-[42px] font-bold  mb-2 md:mb-6 tracking-wide text-zinc-900 dark:text-white'>
								Networks
							</h2>

							<Tabs type='card' defaultActiveKey='1' size={'large'} items={items} />
						</div>
					</motion.section>
				</section>


			</main>

			<Footer />
		</>
	)
}

export default Home
