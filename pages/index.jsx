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

	const items = [
		{
			key: '1',
			label: `All`,
			children: (
				<>
					<h3 className='ant-tabs-heading'>Mainnet</h3>
					<Card data={projects.mainnet} aprValues={aprValues} />
					<h3 className='ant-tabs-heading'>Testnet</h3>
					<Card data={projects.testnet} />
				</>
			)
		},
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
			</main>

			<Footer />
		</>
	)
}

export default Home
