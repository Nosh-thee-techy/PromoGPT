"""
AI Campaign Generation Service
This is a placeholder - you can integrate with OpenAI, Claude, or other AI services
"""
import json
from datetime import datetime, timedelta
from .models import Product, SalesRecord


class CampaignGenerator:
    """Generate marketing campaigns based on business data"""

    def __init__(self, business):
        self.business = business

    def analyze_products(self):
        """Analyze product data"""
        products = Product.objects.filter(business=self.business)

        if not products.exists():
            return {
                'total_products': 0,
                'categories': [],
                'price_range': {'min': 0, 'max': 0},
                'top_products': [],
            }

        analysis = {
            'total_products': products.count(),
            'categories': list(
                products.exclude(category='').values_list('category', flat=True).distinct()
            ),
            'price_range': {
                'min': products.order_by('price').first().price,
                'max': products.order_by('-price').first().price,
            },
            'top_products': list(
                products.order_by('-price')[:5].values('name', 'price', 'category')
            )
        }

        return analysis

    def analyze_sales(self):
        """Analyze sales data"""
        sales = SalesRecord.objects.filter(business=self.business)

        if not sales.exists():
            return {'total_sales': 0, 'total_revenue': 0, 'trends': []}

        total_revenue = sum(sale.revenue for sale in sales)
        total_quantity = sum(sale.quantity for sale in sales)

        # Get top selling products
        top_products = {}
        for sale in sales:
            product_name = sale.product.name
            if product_name not in top_products:
                top_products[product_name] = {'quantity': 0, 'revenue': 0}
            top_products[product_name]['quantity'] += sale.quantity
            top_products[product_name]['revenue'] += sale.revenue

        top_selling = sorted(
            top_products.items(),
            key=lambda x: x[1]['quantity'],
            reverse=True
        )[:5]

        return {
            'total_sales': total_quantity,
            'total_revenue': total_revenue,
            'top_selling': [
                {'product': name, **stats} for name, stats in top_selling
            ]
        }

    def generate_campaign(self, goal='Increase sales', budget=50000):
        """Generate a marketing campaign based on business data"""
        product_analysis = self.analyze_products()
        sales_analysis = self.analyze_sales()

        # Generate campaign summary
        summary = f"""
Campaign Goal: {goal}
Budget: KSh {budget:,.2f}

Business Analysis:
- Total Products: {product_analysis['total_products']}
- Categories: {', '.join(product_analysis['categories']) or 'None'}
- Price Range: KSh {product_analysis['price_range']['min']:,.2f} - KSh {product_analysis['price_range']['max']:,.2f}
- Total Sales: {sales_analysis['total_sales']} units
- Total Revenue: KSh {sales_analysis['total_revenue']:,.2f}

Top Selling Products:
{self._format_top_products(sales_analysis.get('top_selling', []))}

Recommended Actions:
1. Focus on top-performing products
2. Create targeted social media campaigns
3. Offer promotions on high-margin items
4. Leverage WhatsApp for customer engagement
"""

        # Generate social media posts
        social_posts = self._generate_social_posts(product_analysis, sales_analysis, goal)

        # Generate ad copy
        ad_copy = self._generate_ad_copy(product_analysis, sales_analysis, budget)

        # Generate campaign calendar
        calendar = self._generate_calendar()

        # Generate insights
        insights = self._generate_insights(product_analysis, sales_analysis)

        return {
            'summary': summary,
            'social_posts': social_posts,
            'ad_copy': ad_copy,
            'campaign_calendar': calendar,
            'insights': insights,
            'product_analysis': product_analysis,
            'sales_analysis': sales_analysis,
        }

    def _format_top_products(self, top_selling):
        """Format top selling products for display"""
        if not top_selling:
            return "No sales data available yet"
        
        lines = []
        for item in top_selling:
            lines.append(
                f"- {item['product']}: {item['quantity']} units, KSh {item['revenue']:,.2f}"
            )
        return '\n'.join(lines)

    def _generate_social_posts(self, products, sales, goal):
        """Generate social media post suggestions"""
        posts = []
        
        # Instagram post
        posts.append({
            'platform': 'Instagram',
            'content': f"🛍️ Special offer alert! Shop our top products and enjoy amazing deals. Limited time only! #ShopLocal #Kenya #{self.business.name.replace(' ', '')}"
        })

        # Twitter post
        posts.append({
            'platform': 'Twitter/X',
            'content': f"🔥 Don't miss out! We're offering incredible deals on our best-selling products. DM us to order! #{self.business.name.replace(' ', '')} #Nairobi"
        })

        # Facebook post
        posts.append({
            'platform': 'Facebook',
            'content': f"Hi everyone! 👋 We have exciting new offers just for you. Check out our {', '.join(products.get('categories', ['products'])[:2])} and more. Contact us today!"
        })

        # WhatsApp message template
        posts.append({
            'platform': 'WhatsApp',
            'content': f"Hello! 👋 We have special offers on {', '.join([p['name'] for p in products.get('top_products', [])[:3]])}. Reply YES to learn more!"
        })

        return posts

    def _generate_ad_copy(self, products, sales, budget):
        """Generate advertising copy suggestions"""
        ads = []

        # Facebook/Instagram Ad
        ads.append({
            'platform': 'Facebook/Instagram Ads',
            'headline': f"Shop Quality {products.get('categories', ['Products'])[0] if products.get('categories') else 'Products'} in Kenya",
            'primary_text': f"Discover amazing deals at {self.business.name}! We offer the best {', '.join(products.get('categories', ['products'])[:2])} at unbeatable prices. Order now and get fast delivery across Nairobi!",
            'cta': 'Shop Now',
            'budget_allocation': f"KSh {budget * 0.6:,.2f} (60%)"
        })

        # Google Ads
        ads.append({
            'platform': 'Google Ads',
            'headline': f"Buy {products.get('categories', ['Products'])[0] if products.get('categories') else 'Quality Products'} | {self.business.name}",
            'description': f"Best prices on {', '.join(products.get('categories', ['products'])[:2])}. Fast delivery. Order today!",
            'budget_allocation': f"KSh {budget * 0.4:,.2f} (40%)"
        })

        return ads

    def _generate_calendar(self):
        """Generate a campaign calendar"""
        calendar = []
        start_date = datetime.now()

        # Week 1: Launch
        calendar.append({
            'week': 1,
            'date': start_date.strftime('%Y-%m-%d'),
            'content_type': 'Social Media Teaser',
            'platform': 'Instagram, Facebook',
            'time': '10:00 AM'
        })

        # Week 2: Engagement
        calendar.append({
            'week': 2,
            'date': (start_date + timedelta(days=7)).strftime('%Y-%m-%d'),
            'content_type': 'Product Showcase',
            'platform': 'WhatsApp, Instagram Stories',
            'time': '2:00 PM'
        })

        # Week 3: Promotion
        calendar.append({
            'week': 3,
            'date': (start_date + timedelta(days=14)).strftime('%Y-%m-%d'),
            'content_type': 'Special Offer',
            'platform': 'All Channels',
            'time': '12:00 PM'
        })

        # Week 4: Closing
        calendar.append({
            'week': 4,
            'date': (start_date + timedelta(days=21)).strftime('%Y-%m-%d'),
            'content_type': 'Last Chance',
            'platform': 'WhatsApp Broadcast, SMS',
            'time': '9:00 AM'
        })

        return calendar

    def _generate_insights(self, products, sales):
        """Generate marketing insights"""
        insights = []

        # Product insights
        if products['total_products'] > 0:
            insights.append({
                'title': 'Product Diversity',
                'message': f"You have {products['total_products']} products across {len(products['categories'])} categories. Consider cross-selling related items."
            })

        # Sales insights
        if sales['total_sales'] > 0:
            avg_order = sales['total_revenue'] / sales['total_sales']
            insights.append({
                'title': 'Average Order Value',
                'message': f"Your average order value is KSh {avg_order:,.2f}. Try bundling products to increase this metric."
            })

        # Top product insight
        if sales.get('top_selling'):
            top_product = sales['top_selling'][0]
            insights.append({
                'title': 'Star Product',
                'message': f"{top_product['product']} is your best seller! Feature it prominently in your campaigns."
            })

        # Market insight
        insights.append({
            'title': 'Kenyan Market Timing',
            'message': "Launch campaigns after payday (1st-5th and 25th-30th of the month) for better engagement in the Kenyan market."
        })

        return insights