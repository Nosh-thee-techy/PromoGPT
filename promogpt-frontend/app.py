import streamlit as st
import requests
import pandas as pd
import json

BACKEND_URL = "http://localhost:8000"

st.set_page_config(page_title="PromoGPT", page_icon="🚀", layout="wide")

# Bright brand colors
PRIMARY_COLOR = "#FF6F61"  # Bright Coral
SECONDARY_COLOR = "#FFB347"  # Bright Orange
BACKGROUND_COLOR = "#FFF7E6"  # Soft Yellow background
TEXT_COLOR = "#46244C"  # Dark Purple text for contrast

# Inject vibrant CSS styles
st.markdown(
    f"""
    <style>
    .main .block-container {{
        padding-top: 2rem;
        padding-right: 4rem;
        padding-left: 4rem;
        padding-bottom: 2rem;
        background-color: {BACKGROUND_COLOR};
        color: {TEXT_COLOR};
    }}
    .navbar {{
        background-color: {PRIMARY_COLOR};
        padding: 1rem 2rem;
        color: white;
        font-size: 1.6rem;
        font-weight: 700;
        border-radius: 0.7rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(255,111,97,0.4);
    }}
    .section-header {{
        color: {PRIMARY_COLOR};
        font-size: 1.5rem;
        font-weight: 900;
        margin-bottom: 0.75rem;
        margin-top: 1.5rem;
        text-shadow: 1px 1px 3px rgba(255,179,71,0.5);
    }}
    .stButton > button {{
        background-color: {SECONDARY_COLOR};
        color: {TEXT_COLOR};
        border-radius: 0.7rem;
        padding: 0.7rem 1.3rem;
        font-size: 1.1rem;
        font-weight: 800;
        box-shadow: 0 3px 10px rgba(255,179,71,0.6);
        transition: background-color 0.35s ease, color 0.35s ease;
    }}
    .stButton > button:hover {{
        background-color: #ff9c34;
        color: white;
        box-shadow: 0 6px 18px rgba(255,179,71,0.8);
    }}
    .stTextInput > div > input {{
        padding: 10px;
        border: 2.5px solid {PRIMARY_COLOR};
        border-radius: 0.6rem;
        font-size: 1.05rem;
    }}
    .stFileUploader > div > label {{
        font-weight: 700;
        color: {PRIMARY_COLOR};
    }}
    .stNumberInput > div > input {{
        padding: 8px;
        border: 2.5px solid {PRIMARY_COLOR};
        border-radius: 0.5rem;
        font-size: 1.05rem;
    }}
    footer {{
        font-size: 0.9rem;
        color: {TEXT_COLOR};
        text-align: center;
        margin-top: 3rem;
    }}
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown('<div class="navbar">PromoGPT SME Marketing Planner</div>', unsafe_allow_html=True)

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "username" not in st.session_state:
    st.session_state.username = ""

def login():
    st.subheader("User Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        if username and password:
            st.session_state.logged_in = True
            st.session_state.username = username
            st.success(f"Welcome, {username}!")
        else:
            st.error("Please enter username and password")

def logout():
    if st.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.username = ""
        st.experimental_rerun()

def file_preview(files):
    previews = []
    for file in files:
        try:
            df = pd.read_csv(file)
            previews.append(df.head(3))
        except Exception as e:
            previews.append(f"Error reading {file.name}: {e}")
    return previews

def show_campaign_results(campaign):
    st.markdown("### AI Generated Campaign Summary")
    st.write(campaign.get("summary", "No summary provided"))

    st.markdown("### Post Suggestions - Edit if needed")
    posts = campaign.get("posts", [])
    edited_posts = []
    for i, post in enumerate(posts):
        edited = st.text_area(f"Post {i+1}", post, key=f'post_edit_{i}')
        edited_posts.append(edited)

    st.markdown("### Ad Copy Suggestions - Edit if needed")
    ads = campaign.get("ads", [])
    edited_ads = []
    for i, ad in enumerate(ads):
        edited = st.text_area(f"Ad Copy {i+1}", ad, key=f'ad_edit_{i}')
        edited_ads.append(edited)

    if st.button("Download Campaign Content (JSON)"):
        output = {
            "summary": campaign.get("summary"),
            "posts": edited_posts,
            "ads": edited_ads,
        }
        st.download_button(
            label="Download JSON",
            data=json.dumps(output, indent=2),
            file_name="promogpt_campaign.json",
            mime="application/json",
        )

    st.markdown("### Campaign Calendar Overview (Simulated)")
    schedule = campaign.get("schedule", [])
    if not schedule:
        st.info("Schedule data not provided by backend")
    else:
        df_schedule = pd.DataFrame(schedule)
        st.dataframe(df_schedule)

def main_app():
    st.subheader(f"User: {st.session_state.username}")
    logout()

    with st.container():
        st.markdown('<div style="background-color:white; padding:2rem; border-radius:1rem; box-shadow: 4px 4px 20px rgba(255,111,97,0.25);">', unsafe_allow_html=True)

        st.markdown('<div class="section-header">Business Goals & Budget</div>', unsafe_allow_html=True)
        business_goal = st.text_input("Describe your marketing goal (e.g., promote product X)")
        budget = st.number_input("Set marketing budget (USD)", min_value=0, step=10)

        st.markdown('<div class="section-header">Upload Sales and Inventory Data (CSV)</div>', unsafe_allow_html=True)
        uploaded_files = st.file_uploader("Upload CSV files", type=["csv"], accept_multiple_files=True)
        if uploaded_files:
            st.markdown("#### File Previews (first 3 rows)")
            previews = file_preview(uploaded_files)
            for idx, preview in enumerate(previews):
                if isinstance(preview, pd.DataFrame):
                    st.write(f"Preview of {uploaded_files[idx].name}")
                    st.dataframe(preview)
                else:
                    st.error(preview)

        if st.button("Generate AI Campaign and Ads"):
            if not business_goal:
                st.warning("Please enter a business goal to proceed")
            elif not uploaded_files:
                st.warning("Please upload at least one CSV data file")
            else:
                try:
                    with st.spinner("Generating campaign, please wait..."):
                        # Simulate response for now without backend
                        campaign = {
                            "summary": f"Demo campaign for goal: {business_goal} with budget: ${budget}",
                            "posts": [
                                "Post 1: Exciting update about product X!",
                                "Post 2: Limited time offer on product X, don't miss out!"
                            ],
                            "ads": [
                                "Buy Product X now and save 20%! Limited offer!",
                                "Experience premium quality with Product X, order today!"
                            ],
                            "schedule": [
                                {"date": "2025-11-01", "content": "Post 1"},
                                {"date": "2025-11-03", "content": "Ad 1"}
                            ]
                        }
                        show_campaign_results(campaign)
                except Exception as e:
                    st.error(f"Error generating campaign: {e}")

        st.markdown('</div>', unsafe_allow_html=True)

st.sidebar.title("Login")
if not st.session_state.logged_in:
    login()
else:
    main_app()

st.markdown(
    f"""
    <footer style="color:{TEXT_COLOR}; font-size:0.9rem; text-align:center; margin-top:3rem;">
        Developed by PromoGPT Team — &copy; 2025
    </footer>
    """,
    unsafe_allow_html=True,
)
