import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';


interface HomeProps {
  product: {
    priceId: string;
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  
  return (
    [
      <Head>
        <title>Início | ignews</title>
      </Head>,
      
      <main className={styles.contentContainer} >
        <section className={styles.hero} >
          <span>👏 Hey, welcome!</span>
          <h1>News about <br />the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} per month.</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    ]
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IrUu8CHL7Cb4JKTR6pArk6m', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100) 
  };
  
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}